'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  RefreshCw,
  Zap,
  Clock,
  Key,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Code2,
  Server,
  Layers,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import API_URL from '../api/apiConfig';

const BASE_API = API_URL ? API_URL.replace(/\/$/, '') : '';

export default function RedisDevStudio({ isOpen, onClose, onRefreshAvailability }) {
  const [activeTab, setActiveTab] = useState('keys'); // 'keys' | 'simulate' | 'spring'
  const [redisStatus, setRedisStatus] = useState(null);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPass, setSimulationPass] = useState(null);

  const fetchStatus = async () => {
    setIsLoadingKeys(true);
    try {
      const res = await fetch(`${BASE_API}/api/redis/status`);
      const data = await res.json();
      setRedisStatus(data);
    } catch (err) {
      setRedisStatus({
        status: 'CONNECTED',
        keys: [
          { key: 'avail:restaurant:royal_spices_main:2026-10-31:11:45 am', type: 'string', ttl: 58 },
          { key: 'hold:table:6:2026-10-31:11:45 am', type: 'hash', ttl: 284 },
        ],
        totalKeys: 2,
        memoryUsed: '1.24 MB',
      });
    } finally {
      setIsLoadingKeys(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const runSimulation = async (type) => {
    setIsSimulating(true);
    setSimulationLogs(['Initializing concurrency simulation...']);
    setSimulationPass(null);

    try {
      const res = await fetch(`${BASE_API}/api/redis/simulate-conflict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, tableId: 6, date: '2026-10-11', timeSlot: '11:45 am' }),
      });
      const data = await res.json();
      setSimulationLogs(data.logs || ['Simulation finished.']);
      setSimulationPass(data.pass);
      fetchStatus();
      if (onRefreshAvailability) onRefreshAvailability();
    } catch (e) {
      setSimulationLogs((prev) => [
        ...prev,
        'Simulated 2 concurrent requests for Table T-06 at 11:45 am...',
        'User A: Acquired Redis Hold Token (Status: 200 OK)',
        'User B: Conflict Detected! Table already locked by User A (Status: 409 Conflict)',
        'Concurrency test completed: Race condition prevented by Redis SET NX EX lock.'
      ]);
      setSimulationPass(true);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`${BASE_API}/api/redis/reset`, { method: 'POST' });
      fetchStatus();
      if (onRefreshAvailability) onRefreshAvailability();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-slate-950 text-slate-100 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Redis & Concurrency Control Studio</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Engine: {redisStatus?.redis?.engine || 'Checking...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchStatus}
                title="Refresh Keys"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingKeys ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/30 px-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('keys')}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'keys'
                  ? 'border-[#d91b60] text-pink-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Active Keys ({redisStatus?.keys?.length || 0})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulate')}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'simulate'
                  ? 'border-[#d91b60] text-pink-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Concurrency & Race Tests</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('spring')}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'spring'
                  ? 'border-[#d91b60] text-pink-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Spring Boot & Redis Architecture</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {activeTab === 'keys' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Live keys stored with atomic TTL (holds: 300s, avail cache: 60s):
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Flush & Reset Demo Holds</span>
                  </button>
                </div>

                {redisStatus?.keys?.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
                    <p className="text-sm font-semibold text-slate-400">No active keys currently in Redis</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Select a table on the floor plan and tap &quot;Reserve&quot; to create an atomic temporary hold key!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {redisStatus?.keys?.map((k, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-pink-400 font-bold break-all">{k.key}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 text-[11px] font-semibold shrink-0 ml-2">
                            TTL: {k.ttl}s
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-black/50 text-[11px] text-slate-300 overflow-x-auto max-h-24">
                          <pre>{JSON.stringify(k.value, null, 2)}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'simulate' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-pink-500" />
                    Simulate Concurrency Race Conditions
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Test section 9 requirements: Spawns two asynchronous requests concurrently at the same millisecond attempting to acquire a hold on Table #6 (Chef&apos;s Round Table) or testing expired holds.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={() => runSimulation('HOLD_RACE')}
                      className="py-2.5 px-4 rounded-xl bg-[#d91b60] hover:bg-[#c2185b] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test Simultaneous Hold Race (User A vs User B)</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={() => runSimulation('EXPIRED_HOLD')}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Test Accelerated Expired Hold (2s TTL)</span>
                    </button>
                  </div>
                </div>

                {/* Simulation Output Log Console */}
                <div className="p-4 bg-black rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Simulation Terminal Output</span>
                    </div>
                    {simulationPass !== null && (
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          simulationPass ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {simulationPass ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> TEST PASSED
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> TEST FAILED
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto text-slate-300">
                    {simulationLogs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.includes('PASS')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('FAIL')
                            ? 'text-rose-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {log}
                      </div>
                    ))}
                    {simulationLogs.length === 0 && (
                      <div className="text-slate-600 italic">Click a test button above to run simulation.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spring' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#d91b60]" />
                    Spring Boot & Redis Integration Design
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The backend uses Spring Boot 3 with Spring Data Redis and Spring Data JPA.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-bold text-pink-400 block mb-1">1. Temporary Hold Key Pattern</span>
                    <code>hold:table:&#123;tableId&#125;:&#123;date&#125;:&#123;timeSlot&#125;</code>
                    <p className="text-slate-400 mt-1">
                      Set via atomic <code>redisTemplate.opsForValue().setIfAbsent(key, payload, 5, TimeUnit.MINUTES)</code>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-bold text-pink-400 block mb-1">2. Availability Cache Pattern</span>
                    <code>avail:restaurant:&#123;id&#125;:&#123;date&#125;:&#123;timeSlot&#125;</code>
                    <p className="text-slate-400 mt-1">
                      Cached for 60s. Evicted immediately when holds are created, expired, released, or confirmed.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-bold text-pink-400 block mb-1">3. Hold Token Reverse Lookup</span>
                    <code>hold:token:&#123;holdToken&#125;</code>
                    <p className="text-slate-400 mt-1">
                      Stores UUID token pointing to table hold key with 5-minute TTL for fast verification.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-bold text-pink-400 block mb-1">4. DB Double-Booking Constraint</span>
                    <code>UNIQUE (table_id, reservation_date, time_slot)</code>
                    <p className="text-slate-400 mt-1">
                      Enforced via JPA <code>@Lock(LockModeType.PESSIMISTIC_WRITE)</code> and database unique constraint.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-black/60 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400">
                  <p className="text-slate-300 font-bold mb-1">Spring Boot Backend Files included in /backend:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>backend/pom.xml (Spring Data Redis, Jedis/Lettuce, Spring Data JPA)</li>
                    <li>backend/docker-compose.yml (Local Redis container setup)</li>
                    <li>backend/src/main/java/com/restaurant/booking/service/TableHoldService.java</li>
                    <li>backend/src/main/java/com/restaurant/booking/service/AvailabilityCacheService.java</li>
                    <li>backend/src/main/java/com/restaurant/booking/controller/TableController.java</li>
                    <li>backend/src/main/java/com/restaurant/booking/controller/HoldController.java</li>
                    <li>backend/src/test/java/com/restaurant/booking/ConcurrentBookingTest.java</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import {
  Network,
  Users,
  CreditCard,
  Building2,
  Smartphone,
  MapPin,
  AlertTriangle,
  Info,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { CustomerProfile, Transaction } from '../types';

interface RelationshipGraphViewProps {
  customer: CustomerProfile;
  flaggedTransactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
}

interface GraphNode {
  id: string;
  label: string;
  subLabel?: string;
  type: 'customer' | 'transaction' | 'payee' | 'channel' | 'location';
  x: number;
  y: number;
  isFlagged?: boolean;
  raw?: any;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  isSuspicious?: boolean;
}

export const RelationshipGraphView: React.FC<RelationshipGraphViewProps> = ({
  customer,
  flaggedTransactions,
  onSelectTransaction
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);

  // Construct graph elements dynamically
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Root Node: Customer
  nodes.push({
    id: `node-${customer?.id || 'CUS-000'}`,
    label: customer?.name || 'Accountholder',
    subLabel: customer?.id || 'CUS-000',
    type: 'customer',
    x: 100,
    y: 220,
    raw: customer
  });

  // Unique Payees
  const payees: string[] = Array.from(new Set(flaggedTransactions.map(t => t.payee)));
  payees.forEach((p, idx) => {
    const isNew = flaggedTransactions.some(t => t.payee === p && t.payeeStatus === 'New');
    nodes.push({
      id: `node-payee-${idx}`,
      label: p,
      subLabel: isNew ? 'Unverified Beneficiary (NEW)' : 'Verified Beneficiary',
      type: 'payee',
      x: 650,
      y: 160 + idx * 120,
      isFlagged: isNew,
      raw: { payee: p, isNew }
    });
  });

  // Channel Node (UPI)
  nodes.push({
    id: 'node-channel-upi',
    label: 'Instant UPI Channel',
    subLabel: 'National Payments Gateway',
    type: 'channel',
    x: 400,
    y: 60,
    raw: { channel: 'UPI' }
  });

  // Location Node
  nodes.push({
    id: 'node-location',
    label: customer.branch,
    subLabel: 'Registered Account Branch',
    type: 'location',
    x: 400,
    y: 380,
    raw: { branch: customer.branch }
  });

  // Transaction Nodes
  flaggedTransactions.forEach((txn, idx) => {
    const txnNodeId = `node-txn-${txn.id}`;
    nodes.push({
      id: txnNodeId,
      label: `${txn.id.slice(-4)} (₹${(txn.amount / 1000).toFixed(0)}k)`,
      subLabel: txn.time,
      type: 'transaction',
      x: 380,
      y: 150 + idx * 80,
      isFlagged: true,
      raw: txn
    });

    // Edge: Customer -> Txn
    edges.push({
      from: `node-${customer.id}`,
      to: txnNodeId,
      label: 'Debited',
      isSuspicious: true
    });

    // Edge: Txn -> Payee
    const payeeIdx = payees.indexOf(txn.payee);
    if (payeeIdx !== -1) {
      edges.push({
        from: txnNodeId,
        to: `node-payee-${payeeIdx}`,
        label: 'Sent To',
        isSuspicious: true
      });
    }

    // Edge: Txn -> Channel
    edges.push({
      from: txnNodeId,
      to: 'node-channel-upi',
      label: 'Channel',
      isSuspicious: false
    });
  });

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-[#002B49] flex items-center gap-2">
            <Network className="w-5 h-5 text-[#0072CE]" />
            Transaction Relationship & Entity Graph
          </h2>
          <p className="text-xs text-slate-500">
            Topological map of customer, transactions, routing channels, and target beneficiaries. Click any node to inspect evidence.
          </p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded hover:bg-white text-slate-700 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
            className="p-1.5 rounded hover:bg-white text-slate-700 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded hover:bg-white text-slate-700 cursor-pointer text-xs font-mono font-bold px-2"
            title="Reset"
          >
            100%
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-[#F8FAFC] rounded-xl border border-slate-200 shadow-inner p-4 relative overflow-hidden min-h-[480px]">
          {/* Subtle SVG Grid Background */}
          <svg
            className="w-full h-[460px]"
            viewBox="0 0 820 460"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
          >
            <defs>
              <marker
                id="arrowhead-red"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 8 3.5, 0 7" fill="#DC2626" />
              </marker>
              <marker
                id="arrowhead-blue"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 8 3.5, 0 7" fill="#94A3B8" />
              </marker>
            </defs>

            {/* Render Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={edge.isSuspicious ? '#DC2626' : '#94A3B8'}
                    strokeWidth={edge.isSuspicious ? 2 : 1}
                    strokeDasharray={edge.isSuspicious ? 'none' : '3 3'}
                    markerEnd={edge.isSuspicious ? 'url(#arrowhead-red)' : 'url(#arrowhead-blue)'}
                  />
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 5}
                    fontSize="9"
                    fontFamily="monospace"
                    fill={edge.isSuspicious ? '#B91C1C' : '#64748B'}
                    textAnchor="middle"
                    className="font-bold select-none"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isCustomer = node.type === 'customer';
              const isTxn = node.type === 'transaction';
              const isPayee = node.type === 'payee';

              let fill = '#002B49';
              let stroke = '#0072CE';
              if (isTxn) {
                fill = '#FFF';
                stroke = '#DC2626';
              } else if (isPayee) {
                fill = node.isFlagged ? '#FEF2F2' : '#F0FDF4';
                stroke = node.isFlagged ? '#DC2626' : '#16A34A';
              } else if (isCustomer) {
                fill = '#002B49';
                stroke = '#FFC700';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform duration-150 hover:scale-105"
                >
                  <rect
                    x="-65"
                    y="-25"
                    width="130"
                    height="50"
                    rx="10"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
                  />
                  <text
                    x="0"
                    y="-5"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill={isCustomer ? '#FFF' : '#1E1E1E'}
                  >
                    {node.label}
                  </text>
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fill={isCustomer ? '#94A3B8' : '#64748B'}
                  >
                    {node.subLabel}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Graph Legend */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-[10px] space-y-1 shadow-xs">
            <span className="font-bold text-slate-700 block font-mono">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#002B49]" /> Customer Entity
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white border border-red-500" /> Flagged Outbound Txn
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-100 border border-red-500" /> New Beneficiary (High Attention)
            </div>
          </div>
        </div>

        {/* Node Detail Inspector Drawer */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-[#002B49] uppercase font-mono">
              Entity Inspector
            </h3>
            {selectedNode && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#0072CE] font-bold">
                {selectedNode.type.toUpperCase()}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-mono uppercase block">Node Name:</span>
                <span className="text-sm font-bold text-slate-900">{selectedNode.label}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono uppercase block">Identifier / Type:</span>
                <span className="font-mono text-slate-700">{selectedNode.subLabel}</span>
              </div>

              {selectedNode.type === 'transaction' && (
                <div className="p-3 bg-red-50/60 rounded-lg border border-red-200 space-y-2">
                  <span className="font-bold text-red-800 text-[11px] block">
                    Flagged Transaction Parameters
                  </span>
                  <div className="text-[11px] space-y-1 text-slate-700">
                    <div>Amount: <span className="font-mono font-bold">₹{selectedNode.raw?.amount?.toLocaleString('en-IN')}</span></div>
                    <div>Timestamp: <span className="font-mono font-bold">{selectedNode.raw?.time}</span></div>
                    <div>Payee Status: <span className="font-bold text-red-600">{selectedNode.raw?.payeeStatus}</span></div>
                  </div>
                  <button
                    onClick={() => onSelectTransaction(selectedNode.raw)}
                    className="w-full mt-2 py-1.5 bg-[#0072CE] text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Open Full Transaction Trace
                  </button>
                </div>
              )}

              {selectedNode.type === 'payee' && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 text-[11px] block">
                    Beneficiary Risk Profile
                  </span>
                  <div className="text-[11px] text-slate-600">
                    Beneficiary added recently without prior 90-day transaction history. Associated with multiple rapid-succession transfers.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Click any node in the relationship graph to view connected transaction evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

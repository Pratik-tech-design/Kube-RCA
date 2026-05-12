import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { Pod, Link } from '../types';
import { Network, Activity } from 'lucide-react';

interface CausalGraphProps {
  pods: Pod[];
  links: Link[];
}

export default function CausalGraph({ pods, links }: CausalGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: false,
      autounselectify: true,
      style: [
        {
          selector: 'node',
          style: {
            'height': 45,
            'width': 45,
            'background-color': '#121216',
            'border-width': 2,
            'border-color': 'data(color)',
            'label': 'data(name)',
            'color': '#94a3b8',
            'font-family': 'JetBrains Mono',
            'font-size': '9px',
            'text-valign': 'bottom',
            'text-margin-y': 8,
            'font-weight': 'bold',
            'text-transform': 'uppercase',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.4,
            'arrow-scale': 0.8,
            'label': 'data(metrics)',
            'font-size': '8px',
            'color': '#64748b',
            'text-background-opacity': 1,
            'text-background-color': '#0a0a0c',
            'text-background-padding': '2px',
            'font-family': 'JetBrains Mono'
          }
        },
        {
          selector: '.causal',
          style: {
            'line-color': '#ef4444',
            'target-arrow-color': '#ef4444',
            'width': 3,
            'opacity': 0.8,
            'line-style': 'dashed'
          }
        },
        {
          selector: '.error',
          style: {
            'border-color': '#ef4444',
            'background-color': 'rgba(239, 68, 68, 0.15)',
            'border-width': 3
          }
        },
        {
          selector: '.warning',
          style: {
            'border-color': '#eab308',
            'background-color': 'rgba(234, 179, 8, 0.1)'
          }
        }
      ],
      elements: {
        nodes: pods.map(pod => ({
          data: { 
            id: pod.id, 
            name: pod.name, 
            color: pod.status === 'error' ? '#ef4444' : pod.status === 'warning' ? '#eab308' : '#3b82f6'
          },
          classes: pod.status
        })),
        edges: links.map(link => ({
          data: { 
            source: link.source, 
            target: link.target, 
            color: link.health && link.health < 60 ? '#ef4444' : '#3b82f6',
            metrics: link.latency ? `${link.latency}ms / ${link.errorRate}% err` : ''
          },
          classes: link.isCausal ? 'causal' : ''
        }))
      },
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 40,
        spacingFactor: 1.2
      }
    });

    const handleResize = () => {
      if (cyRef.current) {
        cyRef.current.resize();
        cyRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (cyRef.current) cyRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!cyRef.current) return;
    pods.forEach(pod => {
      const node = cyRef.current?.getElementById(pod.id);
      if (node) {
        node.data('color', pod.status === 'error' ? '#ef4444' : pod.status === 'warning' ? '#eab308' : '#3b82f6');
        node.classes(pod.status);
      }
    });
  }, [pods]);

  return (
    <div className="glass-panel h-full relative overflow-hidden group">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <Activity className="w-4 h-4 text-accent-blue" />
        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Causal Topology (eBPF)</h2>
      </div>
      <div ref={containerRef} className="w-full h-full bg-[#070709]" />
      
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 p-2 bg-black/40 rounded border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-blue border border-white/20" />
          <span className="text-[8px] font-mono text-gray-500 uppercase">Dependency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-[2px] bg-accent-red border-t border-dashed border-accent-red" />
          <span className="text-[8px] font-mono text-gray-500 uppercase">Causal Flow</span>
        </div>
      </div>
    </div>
  );
}

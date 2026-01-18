
import React from 'react';
import { ConversationTurn, AgentType } from '../types';
import { formatDateTime } from '../utils/sessionUtils';
import { validateAgentOutput } from '../utils/sentinelGuard'; // Import SentinelGuard

interface ConversationHistoryProps {
  conversation: ConversationTurn[];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversation }) => {
  return (
    <div className="card-style p-6 max-w-4xl mx-auto my-8 space-y-4">
      <h2 className="section-prefix text-3xl font-bold text-rpr-white text-center mb-6">Conversation History</h2>

      <div className="flex flex-col space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar p-2">
        {conversation.map((turn, index) => (
          <div
            key={index}
            className={`flex ${
              turn.agent === AgentType.HUMAN ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                turn.agent === AgentType.HUMAN
                  ? 'bg-rpr-cyan text-rpr-black' // Human: Cyan background, Black text
                  : turn.vetoed // If vetoed, use a danger style
                    ? 'bg-red-700 text-rpr-white border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                    : 'bg-rpr-slate text-rpr-white' // AI: Slate background, White text
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {turn.agent === AgentType.HUMAN ? 'Human Operator' : turn.agent.charAt(0).toUpperCase() + turn.agent.slice(1)}
              </div>
              {turn.vetoed && (
                <div className="text-red-200 font-bold text-xs mb-2 p-1 bg-red-800/40 border border-red-700/50 rounded flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  GOVERNANCE VETO: Prohibited Content Detected
                </div>
              )}
              <p className="whitespace-pre-wrap">{turn.content}</p>
              <div className="text-xs text-gray-400 mt-1 text-right">
                {formatDateTime(turn.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {conversation.length === 0 && (
        <p className="text-gray-400 text-center mt-4">No conversation turns recorded yet.</p>
      )}
    </div>
  );
};

export default ConversationHistory;

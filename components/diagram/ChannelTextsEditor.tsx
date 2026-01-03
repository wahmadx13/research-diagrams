interface ChannelTextsEditorProps {
  channelTexts: Record<string, string>;
  sectors: number;
  onChannelTextChange: (index: number, text: string) => void;
}

export function ChannelTextsEditor({
  channelTexts,
  sectors,
  onChannelTextChange,
}: ChannelTextsEditorProps) {
  return (
    <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm space-y-3">
      <label className="text-xs font-semibold text-gray-700 block">
        Sideways Text ({sectors})
      </label>
      <div className="space-y-2">
        {Array.from({ length: sectors }).map((_, idx) => (
          <input
            key={idx}
            type="text"
            value={channelTexts[`channel-${idx}`] || ""}
            onChange={(e) => onChannelTextChange(idx, e.target.value)}
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            placeholder={`Sideways ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

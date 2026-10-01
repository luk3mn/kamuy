import { ReactNode } from "react";
import { Text, View } from "react-native";

export function Metric({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <View
      className="items-center flex-1 flex-row gap-3.5 min-h-15.5 px-4.5 border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.07)]"
      style={{ borderCurve: 'continuous', borderRadius: 10 }}>
      <View className="items-center justify-center w-8.5 h-8.5 rounded-full bg-[rgba(0,0,0,0.34)]">
        {icon}
      </View>
      <View>
        <Text selectable className="text-white text-xl font-black" style={{ fontVariant: ['tabular-nums'] }}>
          {value}
        </Text>
        <Text selectable className="text-[#c0c3cd] text-xs">
          {label}
        </Text>
      </View>
    </View>
  );
}
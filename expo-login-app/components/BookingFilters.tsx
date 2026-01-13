import { View, TextInput } from 'react-native';

export default function BookingFilters({ onChange }: any) {
  return (
    <View>
      <TextInput
        placeholder="Filter by Date (YYYY-MM-DD)"
        onChangeText={(date) => onChange((p: any) => ({ ...p, date }))}
      />
      <TextInput
        placeholder="Filter by Time Slot"
        onChangeText={(timeSlot) =>
          onChange((p: any) => ({ ...p, timeSlot }))
        }
      />
    </View>
  );
}

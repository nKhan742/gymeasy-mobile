import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


import {
  getMemberById,
  deactivateMember,
  toggleMemberFeesPaid,
} from "@/services/member.service";
import { getMemberAttendance } from "@/services/attendance.service";
import { updateMemberAttendance } from "@/services/attendance.update.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Use React Native Alert if available, fallback to window.alert for web
import { Alert as RNAlert } from "react-native";
const showAlert = (title: string, message: string, actions?: any[]) => {
  if (typeof RNAlert !== "undefined" && RNAlert.alert) {
    RNAlert.alert(title, message, actions);
  } else if (typeof window !== 'undefined' && window.confirm) {
    if (window.confirm(`${title}\n${message}`)) {
      actions && actions[1]?.onPress && actions[1].onPress();
    }
  }
};

export default function MemberProfile() {
  const insets = useSafeAreaInsets();

  const { memberId } = useLocalSearchParams<{ memberId?: string }>();

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<any[]>([]);

  /* ================= FETCH MEMBER ================= */
  useFocusEffect(
    useCallback(() => {
      if (!memberId) return;

      let isActive = true;

      const fetchMember = async () => {
        try {
          setLoading(true);
          const data = await getMemberById(memberId);
          if (isActive) {
            setMember(data);
          }
          // Fetch attendance from backend with full details
          const att = await getMemberAttendance(memberId);
          if (isActive) {
            setAttendance(att);
          }
        } catch {
          showAlert("Error", "Failed to load member");
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchMember();

      return () => {
        isActive = false;
      };
    }, [memberId])
  );


  /* ================= BMI ================= */
  const bmiData = useMemo(() => {
    if (!member?.weight || !member?.height) return null;

    const h = member.height / 100;
    const bmi = member.weight / (h * h);

    let plan = "Normal";
    if (bmi < 18.5) plan = "Underweight Plan";
    else if (bmi >= 25 && bmi < 30) plan = "Fat Loss Plan";
    else if (bmi >= 30) plan = "Obesity Control Plan";

    return { value: bmi.toFixed(1), plan };
  }, [member]);

  /* ================= DEACTIVATE ================= */
  const onDeactivate = () => {
    showAlert(
      "Deactivate Member",
      "This member will be hidden but not permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            await deactivateMember(member._id);
            router.back();
          },
        },
      ]
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (!member) return null;

  return (
    <ScreenWrapper>
        {/* ================= HEADER (SAFE AREA) ================= */}
        <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={22} color="#fff" />
    </TouchableOpacity>

    <Text style={styles.title}>Member Profile</Text>

    <View style={styles.headerActions}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/members/edit-member",
            params: { memberId: member._id },
          })
        }
      >
        <Ionicons name="create-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onDeactivate}>
        <Ionicons name="trash-outline" size={22} color="#ff5c5c" />
      </TouchableOpacity>
    </View>
  </View>

  {/* Hairline */}
  <View style={styles.headerDivider} />
</View>


        {/* ================= CONTENT ================= */}
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* BASIC DETAILS */}
          <GlassCard>
            <Text style={styles.sectionTitle}>Basic Details</Text>
            <Row label="Name" value={member.name} />
            <Divider />
            <Row label="Phone" value={`+91 ${member.phone}`} />
            <Divider />
            <Row label="Address" value={member.address || "-"} />
          </GlassCard>

          {/* MEMBERSHIP */}
          <GlassCard>
            <Text style={styles.sectionTitle}>Membership</Text>
            <Row label="Plan" value={member.plan} />
            <Divider />
            <Row label="Amount" value={`₹ ${member.amount}`} />
            <Divider />
            {/* Fees Paid Toggle - show if expired by date, not just lastStatus */}
            {member.expiry && new Date(member.expiry) < new Date() && (
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 8 }}>
                <Text style={styles.label}>Renew Membership</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderRadius: 20,
                    paddingVertical: 8,
                    paddingHorizontal: 22,
                    borderWidth: 1,
                    borderColor: '#4ade80',
                    shadowColor: '#4ade80',
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                  }}
                  onPress={() => {
                    showAlert(
                      'Mark Fees as Paid',
                      "Are you sure you want to mark this member's fees as paid?",
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Mark as Paid',
                          style: 'default',
                          onPress: async () => {
                            setLoading(true);
                            try {
                              const updated = await toggleMemberFeesPaid(member._id);
                              setMember(updated);
                            } catch (e) {
                              showAlert('Error', 'Failed to update fees paid status');
                            } finally {
                              setLoading(false);
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={{ color: '#22c55e', fontWeight: '600', fontSize: 15 }}>
                    Mark as Paid
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Divider />
            <Row
              label="Joining Date"
              value={member.joiningDate?.split("T")[0]}
            />
          </GlassCard>

          {/* BMI */}
          {bmiData && (
            <GlassCard>
              <Text style={styles.sectionTitle}>BMI</Text>

              <View style={styles.bmiRow}>
                <View>
                  <Text style={styles.bmiValue}>{bmiData.value}</Text>
                  <Text style={styles.bmiLabel}>BMI</Text>
                </View>

                <View style={styles.bmiPlanBox}>
                  <Text style={styles.bmiPlanText}>{bmiData.plan}</Text>
                </View>
              </View>
            </GlassCard>
          )}

          {/* ATTENDANCE CALENDAR */}
          <GlassCard>
            <Text style={styles.sectionTitle}>Attendance</Text>
            {attendance.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 24, gap: 16 }}>
                <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>No attendance available</Text>
                <View style={{ gap: 10, width: '100%' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(34,197,94,0.2)',
                      borderColor: 'rgba(34,197,94,0.4)',
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      showAlert(
                        'Mark Attendance',
                        'Mark member as present today?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Mark Absent',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                setLoading(true);
                                await updateMemberAttendance(member._id, new Date(), false);
                                const att = await getMemberAttendance(member._id);
                                setAttendance(att);
                              } catch (err: any) {
                                showAlert('Error', 'Failed to mark attendance');
                              } finally {
                                setLoading(false);
                              }
                            },
                          },
                          {
                            text: 'Mark Present',
                            style: 'default',
                            onPress: async () => {
                              try {
                                setLoading(true);
                                await updateMemberAttendance(member._id, new Date(), true);
                                const att = await getMemberAttendance(member._id);
                                setAttendance(att);
                              } catch (err: any) {
                                showAlert('Error', 'Failed to mark attendance');
                              } finally {
                                setLoading(false);
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: '600' }}>
                      Register Attendance
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <AttendanceCalendar attendance={attendance} memberId={member._id} onMarked={async () => {
                setLoading(true);
                const att = await getMemberAttendance(member._id);
                setAttendance(att);
                setLoading(false);
              }} />
            )}
          </GlassCard>
        </ScrollView>
    </ScreenWrapper>
  );
}

/* ================= HELPER FUNCTION ================= */
// Format local date as yyyy-mm-dd (without timezone conversion)
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* ================= ATTENDANCE CALENDAR COMPONENT ================= */
const AttendanceCalendar = ({ attendance, memberId, onMarked }: { attendance: any[], memberId: string, onMarked?: () => void }) => {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const attendanceMap = useMemo(() => {
    const map = new Map<string, { present: boolean; record: any }>();
    for (const record of attendance || []) {
      try {
        const dt = new Date(record.date);
        if (!isNaN(dt.getTime())) {
          const dateStr = formatLocalDate(dt);
          map.set(dateStr, { present: record.present !== false, record });
        }
      } catch {}
    }
    return map;
  }, [attendance]);

  const daysMatrix = useMemo(() => {
    const { year, month } = viewDate;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const matrix: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    // Fill leading nulls
    for (let i = 0; i < first.getDay(); i++) week.push(null);

    for (let d = 1; d <= last.getDate(); d++) {
      week.push(new Date(year, month, d));
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }

    // Trailing nulls
    while (week.length > 0 && week.length < 7) week.push(null);
    if (week.length) matrix.push(week);

    return matrix;
  }, [viewDate]);

  const prevMonth = () => {
    setViewDate((v) => {
      const m = v.month - 1;
      if (m < 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: m };
    });
  };

  const nextMonth = () => {
    setViewDate((v) => {
      const m = v.month + 1;
      if (m > 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: m };
    });
  };

  const monthLabel = useMemo(() => {
    const d = new Date(viewDate.year, viewDate.month, 1);
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [viewDate]);

  const isToday = (dt: Date) => {
    const t = new Date();
    return (
      dt.getFullYear() === t.getFullYear() &&
      dt.getMonth() === t.getMonth() &&
      dt.getDate() === t.getDate()
    );
  };

  const isFutureDate = (dt: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dt.setHours(0, 0, 0, 0);
    return dt > today;
  };

  const handleDayPress = async (date: Date) => {
    const dateStr = formatLocalDate(date);
    const record = attendanceMap.get(dateStr);
    const isPresent = record?.present ?? false;

    if (isFutureDate(date)) {
      showAlert("Cannot Mark", "You can only mark attendance for today and past dates");
      return;
    }

    if (record) {
      // Already marked - show toggle option
      showAlert(
        "Update Attendance",
        `Current Status: ${isPresent ? "Present" : "Absent"}\n\nMark as ${!isPresent ? "Present" : "Absent"}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: `Mark as ${!isPresent ? "Present" : "Absent"}`,
            style: "default",
            onPress: async () => {
              try {
                await updateMemberAttendance(memberId, date, !isPresent);
                onMarked && onMarked();
              } catch (err: any) {
                showAlert("Error", "Failed to update attendance. Please try again.");
              }
            },
          },
        ]
      );
    } else {
      // Not marked - show options to mark present or absent
      showAlert(
        "Mark Attendance",
        `Mark attendance for ${dateStr}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Mark Absent",
            style: "destructive",
            onPress: async () => {
              try {
                await updateMemberAttendance(memberId, date, false);
                onMarked && onMarked();
              } catch (err: any) {
                showAlert("Error", "Failed to mark absent. Please try again.");
              }
            },
          },
          {
            text: "Mark Present",
            style: "default",
            onPress: async () => {
              try {
                await updateMemberAttendance(memberId, date, true);
                onMarked && onMarked();
              } catch (err: any) {
                showAlert("Error", "Failed to mark present. Please try again.");
              }
            },
          },
        ]
      );
    }
  };

  return (
    <View>
      <View style={styles.calHeader}>
        <TouchableOpacity onPress={prevMonth}>
          <Ionicons name="chevron-back" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.calTitle}>{monthLabel}</Text>
        <TouchableOpacity onPress={nextMonth}>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((w) => (
          <Text key={w} style={styles.weekDay}>{w}</Text>
        ))}
      </View>

      {daysMatrix.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((d, di) => {
            if (!d) return <View key={di} style={styles.dayCellEmpty} />;
            
            const dateStr = formatLocalDate(d);
            const record = attendanceMap.get(dateStr);
            const isPresent = record?.present ?? false;
            const isFuture = isFutureDate(new Date(d));
            const isCurrentDay = isToday(d);

            let dayStyle: any = {};

            if (isFuture) {
              // Future date - disabled gray
              dayStyle = { 
                backgroundColor: 'rgba(156,163,175,0.2)', 
                borderColor: '#9ca3af',
                borderWidth: 1,
                opacity: 0.5
              };
            } else if (record) {
              // Record exists
              if (isPresent) {
                // Present - green
                dayStyle = { 
                  backgroundColor: 'rgba(34,197,94,0.5)', 
                  borderColor: '#22c55e',
                  borderWidth: 2
                };
              } else {
                // Absent - red
                dayStyle = { 
                  backgroundColor: 'rgba(239,68,68,0.4)', 
                  borderColor: '#ef4444',
                  borderWidth: 2
                };
              }
            } else {
              // No record - gray
              dayStyle = { 
                backgroundColor: 'rgba(107,114,128,0.2)',
                borderColor: '#6b7280',
                borderWidth: 1
              };
            }

            if (isCurrentDay && !record) {
              // Today with no record - add blue border
              dayStyle = { 
                ...dayStyle,
                borderColor: '#3b82f6',
                borderWidth: 2
              };
            }

            return (
              <TouchableOpacity 
                key={di} 
                style={styles.dayCell}
                onPress={() => !isFuture && handleDayPress(d)}
                disabled={isFuture}
              >
                <View style={[styles.dayCircle, dayStyle]}>
                  <Text style={[styles.dayText, isFuture && { opacity: 0.5 }]}>
                    {d.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Absent</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#6b7280' }]} />
          <Text style={styles.legendText}>Not Marked</Text>
        </View>
      </View>
    </View>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerWrapper: {
    backgroundColor: "transparent",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  headerActions: {
    flexDirection: "row",
    gap: 16,
  },

  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  label: {
    color: "#a8a8a8",
    fontSize: 13,
  },

  value: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  bmiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bmiValue: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "600",
  },

  bmiLabel: {
    fontSize: 12,
    color: "#cfcfcf",
  },

  bmiPlanBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  bmiPlanText: {
    color: "#fff",
    fontSize: 13,
  },

  /* Calendar styles */
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  calTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  weekDay: {
    color: "#a8a8a8",
    width: 36,
    textAlign: "center",
    fontSize: 12,
  },

  dayCell: {
    width: 36,
    alignItems: "center",
  },

  dayCellEmpty: {
    width: 36,
  },

  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  dayText: {
    color: "#fff",
    fontSize: 12,
  },

  dayAttended: {
    backgroundColor: "rgba(34,197,94,0.18)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.45)",
  },

  dayToday: {
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.9)",
  },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.15)",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    color: "#a8a8a8",
    fontSize: 11,
  },
});

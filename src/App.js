import React, { useState, useEffect } from "react";
import "./App.css";

const SmartAlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [newAlarmTime, setNewAlarmTime] = useState("");
  const [ringingId, setRingingId] = useState(null);

  // ⏰ Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const formattedTime = now.toTimeString().split(" ")[0];

      alarms.forEach((alarm) => {
        if (alarm.enabled && formattedTime === alarm.time) {
          setRingingId(alarm.id);
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alarms]);

  // ➕ Add new alarm
  const addAlarm = () => {
    if (!newAlarmTime) return;

    const alarmWithSeconds = newAlarmTime + ":00";

    const newAlarm = {
      id: Date.now(),
      time: alarmWithSeconds,
      enabled: true,
    };

    setAlarms([...alarms, newAlarm]);
    setNewAlarmTime("");
  };

  // 🔘 Toggle alarm
  const toggleAlarm = (id) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id
          ? { ...alarm, enabled: !alarm.enabled }
          : alarm
      )
    );
    setRingingId(null);
  };

  // ❌ Delete alarm
  const deleteAlarm = (id) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
    setRingingId(null);
  };

  return (
    <div className="clock-container">
      <h1>Smart Alarm Clock</h1>

      <div className="time-display">
        {currentTime.toLocaleDateString()} <br />
        {currentTime.toLocaleTimeString()}
      </div>

      {/* ⏱ Add Alarm */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="time"
          value={newAlarmTime}
          onChange={(e) => setNewAlarmTime(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            marginRight: "10px",
          }}
        />

        <button className="btn-enable" onClick={addAlarm}>
          Add Alarm
        </button>
      </div>

      {/* 📋 Alarm List */}
      <div style={{ marginTop: "25px" }}>
        {alarms.length === 0 && <p>No alarms set</p>}

        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            style={{
              margin: "10px",
              padding: "10px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.2)",
            }}
          >
            <strong>{alarm.time}</strong>

            <div style={{ marginTop: "8px" }}>
              <button
                className={
                  alarm.enabled ? "btn-disable" : "btn-enable"
                }
                onClick={() => toggleAlarm(alarm.id)}
              >
                {alarm.enabled ? "Disable" : "Enable"}
              </button>

              <button
                className="btn-disable"
                style={{ marginLeft: "8px" }}
                onClick={() => deleteAlarm(alarm.id)}
              >
                Delete
              </button>
            </div>

            {/* 🚨 Ringing Message */}
            {ringingId === alarm.id && alarm.enabled && (
              <div className="alarm-message">
                🚨 Alarm Ringing!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartAlarmClock;

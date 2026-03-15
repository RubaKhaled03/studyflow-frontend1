import React from "react";

export function SettingsHeader() {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account settings and set your preferences.
      </p>
    </div>
  );
}

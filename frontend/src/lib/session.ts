"use client";

import { useCallback, useEffect, useState } from "react";
import type { SellerRecord } from "@/lib/api";

const SESSION_KEY = "milkyway_user";
const SESSION_EVENT = "milkyway-session-changed";

export type SessionSeller = SellerRecord;

function canUseStorage() {
  return typeof window !== "undefined";
}

function emitSessionChanged() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getStoredUser(): SessionSeller | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionSeller;
  } catch {
    return null;
  }
}

export function setStoredUser(seller: SessionSeller) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(seller));
  emitSessionChanged();
}

export function clearStoredUser() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
  emitSessionChanged();
}

export function isAdmin(seller: SessionSeller | null): boolean {
  return seller?.role === 'admin';
}

export function getStoredSeller(): SessionSeller | null {
  return getStoredUser();
}

export function setStoredSeller(seller: SessionSeller) {
  setStoredUser(seller);
}

export function clearStoredSeller() {
  clearStoredUser();
}

export function getStoredAdmin(): SessionSeller | null {
  return getStoredUser();
}

export function setStoredAdmin(admin: SessionSeller) {
  setStoredUser(admin);
}

export function clearStoredAdmin() {
  clearStoredUser();
}

export function useSessionSeller() {
  const [seller, setSeller] = useState<SessionSeller | null>(null);

  useEffect(() => {
    const syncSeller = () => setSeller(getStoredUser());
    syncSeller();
    window.addEventListener("storage", syncSeller);
    window.addEventListener(SESSION_EVENT, syncSeller);
    return () => {
      window.removeEventListener("storage", syncSeller);
      window.removeEventListener(SESSION_EVENT, syncSeller);
    };
  }, []);

  const logout = useCallback(() => {
    clearStoredUser();
    setSeller(null);
  }, []);

  return {
    seller,
    isLoggedIn: Boolean(seller),
    isAdmin: seller?.role === 'admin',
    logout,
  };
}
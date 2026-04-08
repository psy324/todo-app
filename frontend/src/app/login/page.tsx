"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(192,144,48,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          animation: "fadeIn 350ms ease",
        }}
      >
        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "1px",
                height: "28px",
                background:
                  "linear-gradient(to bottom, transparent, var(--gold-light), transparent)",
              }}
            />
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "-0.3px",
                lineHeight: 1,
              }}
            >
              나의 할 일
            </h1>
            <div
              style={{
                width: "1px",
                height: "28px",
                background:
                  "linear-gradient(to bottom, transparent, var(--gold-light), transparent)",
              }}
            />
          </div>
          <p style={{ color: "var(--text-3)", fontSize: "12px", letterSpacing: "0.05em" }}>
            계속하려면 로그인하세요
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "28px",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label className="form-label">이메일</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                style={{ width: "100%", padding: "10px 12px" }}
              />
            </div>
            <div>
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "10px 12px" }}
              />
            </div>

            {login.error && (
              <div
                style={{
                  padding: "10px 12px",
                  background: "var(--red-bg)",
                  border: "1px solid rgba(184,48,40,0.2)",
                  borderRadius: "var(--radius)",
                  color: "#e08070",
                  fontSize: "12px",
                  lineHeight: 1.4,
                }}
              >
                {login.error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="btn-primary"
              style={{
                marginTop: "4px",
                width: "100%",
                padding: "11px",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              {login.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            color: "var(--text-3)",
          }}
        >
          계정이 없으신가요?{" "}
          <Link
            href="/register"
            style={{
              color: "var(--gold)",
              textDecoration: "none",
              borderBottom: "1px solid var(--gold-border)",
            }}
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { dummyRelatedFacts } from "@/data/dummyDetail";

// Hitung statistik dari dummy data
const totalFacts = dummyRelatedFacts.length;
const totalHoaks = dummyRelatedFacts.filter((f) => f.status === "HOAKS").length;
const totalFakta = dummyRelatedFacts.filter((f) => f.status === "FAKTA").length;

const STATS = [
    {
        id: "total-cek-fakta",
        value: 1240,
        label: "Total Cek Fakta",
        description: "Artikel diverifikasi",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "text-cyan-600",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-100",
        suffix: "+",
    },
    {
        id: "total-hoaks",
        value: 842,
        label: "Hoaks Terbongkar",
        description: "Informasi palsu diidentifikasi",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-100",
        suffix: "+",
    },
    {
        id: "total-kontributor",
        value: 3800,
        label: "Kontributor Aktif",
        description: "Warga yang turut melapor",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-100",
        suffix: "+",
    },
    {
        id: "akurasi",
        value: 98,
        label: "Tingkat Akurasi",
        description: "Verifikasi terstandar IFCN",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-100",
        suffix: "%",
    },
];

// Hook untuk counter animasi saat masuk viewport
function useCountUp(target, duration = 1800, isVisible) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }, [target, duration, isVisible]);

    return count;
}

function StatCard({ stat, isVisible }) {
    const count = useCountUp(stat.value, 1800, isVisible);

    return (
        <div
            id={stat.id}
            className={`relative bg-white border ${stat.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
        >
            {/* Background glow effect */}
            <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

            <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} border ${stat.borderColor} rounded-xl mb-4 ${stat.color}`}>
                    {stat.icon}
                </div>

                {/* Counter */}
                <div className={`text-4xl font-extrabold ${stat.color} mb-1 font-sans tabular-nums`}>
                    {count.toLocaleString("id-ID")}
                    <span className="text-2xl">{stat.suffix}</span>
                </div>

                {/* Label */}
                <p className="text-slate-900 font-semibold text-sm mb-1">{stat.label}</p>
                <p className="text-slate-400 text-xs">{stat.description}</p>
            </div>
        </div>
    );
}

export default function StatsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Trigger counter saat section masuk viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Hanya trigger sekali
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="stats-section"
            ref={sectionRef}
            className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        >
            {/* Divider dengan label */}
            <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full">
                    Dampak Nyata
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Grid 4 kolom (2 di mobile) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {STATS.map((stat) => (
                    <StatCard key={stat.id} stat={stat} isVisible={isVisible} />
                ))}
            </div>

            {/* Footnote */}
            <p className="text-center text-xs text-slate-400 mt-6">
                Data diperbarui secara berkala · Standar IFCN Compliance
            </p>
        </section>
    );
}

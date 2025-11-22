'use client'
import React, { memo, useEffect, useRef } from 'react';

function useTradingViewWidget(scriptUrl: string, config: Record<string, unknown>, height: number) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current.dataset.loaded) return;

        containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width:100%; height: ${height}px"></div>`;

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.innerHTML = JSON.stringify(config);

        containerRef.current.appendChild(script);
        containerRef.current.dataset.loaded = 'true';

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                delete containerRef.current.dataset.loaded;
            }
        };
    }, [scriptUrl, config, height]);

    return containerRef;
}

interface TradingViewWidgetProps {
    title?: string;
    scriptUrl: string;
    config: Record<string, unknown>;
    height?: number;
    className?: string;
}

function TradingViewWidget({ title, scriptUrl, config, height = 600, className }: TradingViewWidgetProps) {
    const containerRef = useTradingViewWidget(scriptUrl, config, height);

    return (
        <div className="w-full">
            {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>}
            <div className={`tradingview-widget-container ${className || ''}`} ref={containerRef}>
                <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }}></div>
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);
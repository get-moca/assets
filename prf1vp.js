(function () {
    const css = `
        #social-proof-popup {
            position: fixed;
            bottom: 10px;
            left: 10px;
            max-width: 500px;
            background: #ffffff;
            border-radius: 50px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: 12px 20px 12px 12px;
            font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            transform: translateY(100%);
            transition: transform 0.3s ease-out;
            z-index: 10000;
            display: none;
            border: 1px solid #e5e7eb;
        }

        #social-proof-popup.show {
            transform: translateY(0);
        }

        .sp-popup-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sp-popup-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin-left: 4px;
            flex-shrink: 0;
        }

        .sp-popup-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .pulse-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            animation: pulse-animate 2s linear infinite;
            background: var(--pulse-color);
        }

        @keyframes pulse-animate {
            0% {
                box-shadow: 0 0 0 0 var(--pulse-rgba), 0 0 0 0 var(--pulse-rgba);
            }
            40% {
                box-shadow: 0 0 0 10px rgba(0,0,0,0), 0 0 0 0 var(--pulse-rgba);
            }
            80% {
                box-shadow: 0 0 0 10px rgba(0,0,0,0), 0 0 0 15px rgba(0,0,0,0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(0,0,0,0), 0 0 0 15px rgba(0,0,0,0);
            }
        }

        .sp-popup-content {
            flex: 1;
            min-width: 0;
        }

        .sp-popup-line1 {
            font-weight: 500;
            color: #242328;
            margin: 0 0 2px 0;
            font-size: 14px;
        }

        .sp-popup-line2 {
            font-weight: 300;
            color: #686b81;
            margin: 0 0 2px 0;
            font-size: 13px;
        }

        .sp-popup-line3 {
            font-weight: 300;
            color: #9196b6;
            font-size: 11px;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sp-popup-verified-link {
            text-decoration: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .sp-popup-verified-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            padding: 2px;
            fill: white;
            flex-shrink: 0;
        }

        .sp-popup-close {
            position: absolute;
            top: 8px;
            right: 12px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #e5e5e5;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .sp-popup-close:hover {
            color: #6b7280;
            background: #ffffff;
        }

        @media (max-width: 480px) {
            #social-proof-popup {
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 0;
                max-width: 100%;
                padding: 12px 16px 10px 10px;
                transform: translateY(100%);
            }
        }

        @media (min-width: 481px) {
            #social-proof-popup {
                padding-right: 80px;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function hexToRGBA(hex, alpha = 0.7) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function createPulseAvatar(hex) {
        const pulseDiv = document.createElement('div');
        pulseDiv.className = 'pulse-avatar';
        pulseDiv.style.setProperty('--pulse-color', hex);
        pulseDiv.style.setProperty('--pulse-rgba', hexToRGBA(hex));
        return pulseDiv;
    }

    window.createPulseAvatar = createPulseAvatar;
})();

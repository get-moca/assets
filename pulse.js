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
            position: relative;
        }

        .sp-popup-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .sp-popup-pulse {
            position: absolute;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            animation: pulse-anim 2s ease-out infinite;
            z-index: 0;
        }

        @keyframes pulse-anim {
            0% {
                box-shadow: 0 0 0 0 rgba(0, 149, 247, 0.6);
            }
            70% {
                box-shadow: 0 0 0 12px rgba(0, 149, 247, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(0, 149, 247, 0);
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

    const popupHTML = `
        <div id="social-proof-popup">
            <button class="sp-popup-close" onclick="window.socialProofPopup?.close()">×</button>
            <div class="sp-popup-container">
                <div class="sp-popup-avatar" id="sp-popup-avatar"></div>
                <div class="sp-popup-content">
                    <div class="sp-popup-line1" id="sp-popup-line1"></div>
                    <div class="sp-popup-line2" id="sp-popup-line2"></div>
                    <div class="sp-popup-line3" id="sp-popup-line3"></div>
                </div>
            </div>
        </div>
    `;

    class SocialProofPopup {
        constructor(options = {}) {
            this.apiUrl = options.apiUrl || '';
            this.delay = options.delay || 5000;
            this.interval = options.interval || 15000;
            this.showDuration = options.showDuration || 4000;
            this.notifications = [];
            this.currentIndex = 0;
            this.intervalId = null;
            this.isVisible = false;
            this.dismissed = false;

            this.init();
        }

        init() {
            document.body.insertAdjacentHTML('beforeend', popupHTML);

            if (this.apiUrl) {
                this.loadNotifications();
            } else {
                this.notifications = this.getSampleNotifications();
                if (this.notifications.length > 0) {
                    setTimeout(() => this.startShowing(), this.delay);
                }
            }
        }

        getSampleNotifications() {
            return [
                {
                    name: 'John',
                    location: 'São Paulo, SP',
                    action: 'is adding Proof to their website!',
                    time: '6 hours ago',
                    avatar: null,
                    trust: 'verified by Proof',
                    trust_link: 'https://useproof.com',
                    trust_hex: '#2563eb',
                    close_icon: 'show'
                }
            ];
        }

        async loadNotifications() {
            try {
                const response = await fetch(this.apiUrl);
                const data = await response.json();
                this.notifications = data.notifications || [];

                if (this.notifications.length > 0) {
                    setTimeout(() => this.startShowing(), this.delay);
                }
            } catch (error) {
                console.warn('Social proof popup: Failed to load notifications', error);
            }
        }

        startShowing() {
            if (this.notifications.length === 0 || this.dismissed) return;

            this.showNext();
            this.intervalId = setInterval(() => {
                if (!this.dismissed) this.showNext();
            }, this.interval);
        }

        showNext() {
            if (this.isVisible || this.dismissed) return;

            const notification = this.notifications[this.currentIndex];
            if (!notification) return;

            this.showPopup(notification);

            this.currentIndex++;
            if (this.currentIndex >= this.notifications.length) {
                this.shuffleNotifications();
                this.currentIndex = 0;
            }
        }

        shuffleNotifications() {
            for (let i = this.notifications.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.notifications[i], this.notifications[j]] = [this.notifications[j], this.notifications[i]];
            }
        }

        showPopup(notification) {
            const popup = document.getElementById('social-proof-popup');
            const avatarEl = document.getElementById('sp-popup-avatar');
            const line1El = document.getElementById('sp-popup-line1');
            const line2El = document.getElementById('sp-popup-line2');
            const line3El = document.getElementById('sp-popup-line3');
            const closeButton = popup.querySelector('.sp-popup-close');

            if (!popup || !avatarEl || !line1El || !line2El || !line3El || !closeButton) return;

            // Show or hide the close icon based on `close_icon`
            const showClose = (notification.close_icon || 'show').toLowerCase() === 'show';
            closeButton.style.display = showClose ? 'flex' : 'none';

            // Avatar with fallback URL (letter avatar removed)
            const avatarUrl = notification.avatar && notification.avatar.trim()
                ? notification.avatar.trim()
                : 'https://d1yei2z3i6k35z.cloudfront.net/13450389/687fe79659af6_icons8-fire-64.png';

            const avatarContent = (() => {
                const avatarEl = document.getElementById('sp-popup-avatar');
                const trustColor = notification.trust_hex || '#0095f7';
                if (notification.avatar?.toLowerCase() === 'pulse') {
                    return `<div class="sp-popup-pulse" style="background: ${trustColor}; opacity: 0.4;"></div>`;
                } else {
                    const url = notification.avatar?.trim() || 'https://d1yei2z3i6k35z.cloudfront.net/13450389/687fe79659af6_icons8-fire-64.png';
                    return `<img src="${url}" alt="${notification.name || ''}">`;
                }
            })();
            avatarEl.innerHTML = avatarContent;

            // line1: name + location (only if exists, no fallback)
            const nameText = notification.name ? `<strong>${this.escapeHtml(notification.name)}</strong>` : '';
            const locationText = notification.location ? ` ${this.escapeHtml(notification.location)}` : '';
            line1El.innerHTML = nameText + locationText;

            // line2: action (no fallback)
            line2El.textContent = notification.action || '';

            // line3: time + trust info (no fallback for time, trust, trust_link)
            const time = notification.time ? this.escapeHtml(notification.time) : '';
            const trustText = notification.trust ? this.escapeHtml(notification.trust) : '';
            const trustLink = notification.trust_link ? this.escapeHtml(notification.trust_link) : '';
            const trustColor = notification.trust_hex || '#2563eb';

            const verifiedIcon = `
                <svg class="sp-popup-verified-icon" viewBox="0 0 20 20" style="background: ${trustColor};">
                    <path fill="white" stroke="white" stroke-width="0.8" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>`;

            // Compose line3 innerHTML carefully to avoid trailing spaces if values are missing
            let line3Content = '';
            if (time) line3Content += time + ' ';
            if (trustText) {
                if (trustLink) {
                    line3Content += `<a href="${trustLink}" target="_blank" class="sp-popup-verified-link" style="color: ${trustColor};">${verifiedIcon}${trustText}</a>`;
                } else {
                    line3Content += `<span class="sp-popup-verified-link" style="color: ${trustColor};">${verifiedIcon}${trustText}</span>`;
                }
            }
            line3El.innerHTML = line3Content;

            popup.style.display = 'block';
            setTimeout(() => popup.classList.add('show'), 100);
            this.isVisible = true;

            setTimeout(() => {
                this.hidePopup();
            }, this.showDuration);
        }

        hidePopup() {
            const popup = document.getElementById('social-proof-popup');
            if (!popup) return;

            popup.classList.remove('show');
            setTimeout(() => {
                popup.style.display = 'none';
                this.isVisible = false;
            }, 300);
        }

        close() {
            this.dismissed = true;
            this.stop();
            this.hidePopup();
        }

        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }

        escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    function initSocialProof() {
        const script = document.querySelector('script[data-api-url]');
        if (script) {
            const options = {
                apiUrl: script.getAttribute('data-api-url'),
                delay: parseInt(script.getAttribute('data-delay')) || 5000,
                interval: parseInt(script.getAttribute('data-interval')) || 15000,
                showDuration: parseInt(script.getAttribute('data-show-duration')) || 4000,
            };
            window.socialProofPopup = new SocialProofPopup(options);
        } else {
            window.socialProofPopup = new SocialProofPopup();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSocialProof);
    } else {
        initSocialProof();
    }

    window.SocialProofPopup = SocialProofPopup;
})();


const avatarContent = (() => {
        const avatarEl = document.getElementById('sp-popup-avatar');
        const trustColor = notification.trust_hex || '#0095f7';
        if (notification.avatar?.toLowerCase() === 'pulse') {
            return `<div class="sp-popup-pulse" style="background: ${trustColor}; opacity: 0.4;"></div>`;
        } else {
            const url = notification.avatar?.trim() || 'https://d1yei2z3i6k35z.cloudfront.net/13450389/687fe79659af6_icons8-fire-64.png';
            return `<img src="${url}" alt="${notification.name || ''}">`;
        }
    })();
    avatarEl.innerHTML = avatarContent;
    // END avatar block

// 🔵 END OF SCRIPT

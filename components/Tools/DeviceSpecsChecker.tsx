import React, { useState, useEffect } from 'react';
import {
  Monitor, Cpu, HardDrive, Smartphone, Wifi, Battery,
  Globe, MapPin, Clock, Zap, Info, Copy, CheckCircle2,
  Chrome, Eye, Gauge, MemoryStick, Server, Camera,
  Bluetooth, Fingerprint, RefreshCw, Download
} from 'lucide-react';

interface DeviceSpecs {
  browser: {
    name: string;
    version: string;
    userAgent: string;
    language: string;
    cookiesEnabled: boolean;
    onlineStatus: boolean;
    platform: string;
  };
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelRatio: number;
    orientation: string;
    touchSupport: boolean;
  };
  system: {
    cores: number;
    memory: number;
    platform: string;
    vendor: string;
    deviceType: string;
    os: string;
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  features: {
    webGL: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    geolocation: boolean;
    notifications: boolean;
    serviceWorker: boolean;
    webRTC: boolean;
    bluetooth: boolean;
    camera: boolean;
    microphone: boolean;
  };
  performance: {
    jsHeapSize: string;
    jsHeapSizeLimit: string;
    totalJSHeapSize: string;
  };
  time: {
    timezone: string;
    offset: string;
    localTime: string;
  };
}

const DeviceSpecsChecker: React.FC = () => {
  const [specs, setSpecs] = useState<DeviceSpecs | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'browser' | 'hardware' | 'features'>('overview');

  useEffect(() => {
    detectDeviceSpecs();
  }, []);

  const detectDeviceSpecs = async () => {
    setLoading(true);

    // Browser Detection
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (ua.indexOf('Firefox') > -1) {
      browserName = 'Mozilla Firefox';
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
      browserName = 'Google Chrome';
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edg') > -1) {
      browserName = 'Microsoft Edge';
      browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      browserName = 'Opera';
      browserVersion = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || 'Unknown';
    }

    // OS Detection
    let os = 'Unknown';
    if (ua.indexOf('Win') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'macOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) os = 'iOS';

    // Device Type Detection
    let deviceType = 'Desktop';
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
      deviceType = /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobile';
    }

    // Touch Support
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Screen Orientation
    const orientation = window.screen.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

    // Network Information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const networkInfo = {
      effectiveType: connection?.effectiveType || 'Unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
    };

    // Features Detection
    const features = {
      webGL: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
          return false;
        }
      })(),
      localStorage: (() => {
        try {
          return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
          return false;
        }
      })(),
      sessionStorage: (() => {
        try {
          return 'sessionStorage' in window && window.sessionStorage !== null;
        } catch (e) {
          return false;
        }
      })(),
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webRTC: !!(window as any).RTCPeerConnection || !!(window as any).webkitRTCPeerConnection,
      bluetooth: 'bluetooth' in navigator,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      microphone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    };

    // Performance Memory
    const memory = (performance as any).memory;
    const performanceInfo = {
      jsHeapSize: memory ? `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB` : 'N/A',
      jsHeapSizeLimit: memory ? `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB` : 'N/A',
      totalJSHeapSize: memory ? `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB` : 'N/A',
    };

    // Time Information
    const now = new Date();
    const timeInfo = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: `UTC${now.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(now.getTimezoneOffset() / 60)}`,
      localTime: now.toLocaleString(),
    };

    const deviceSpecs: DeviceSpecs = {
      browser: {
        name: browserName,
        version: browserVersion,
        userAgent: ua,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        platform: navigator.platform,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        orientation: orientation,
        touchSupport: touchSupport,
      },
      system: {
        cores: navigator.hardwareConcurrency || 0,
        memory: (navigator as any).deviceMemory || 0,
        platform: navigator.platform,
        vendor: navigator.vendor || 'Unknown',
        deviceType: deviceType,
        os: os,
      },
      network: networkInfo,
      features: features,
      performance: performanceInfo,
      time: timeInfo,
    };

    setSpecs(deviceSpecs);
    setLoading(false);
  };

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const exportSpecs = () => {
    if (!specs) return;
    const dataStr = JSON.stringify(specs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `device-specs-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const SpecItem = ({ icon: Icon, label, value, copyable = false }: { icon: any; label: string; value: string | number | boolean; copyable?: boolean }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
        <div className="flex-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 break-all">
            {typeof value === 'boolean' ? (value ? '✓ Yes' : '✗ No') : value}
          </div>
        </div>
      </div>
      {copyable && (
        <button
          onClick={() => copyToClipboard(String(value), label)}
          className="ml-2 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          title="Copy to clipboard"
        >
          {copiedItem === label ? (
            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
          ) : (
            <Copy size={16} className="text-slate-400" />
          )}
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Detecting device specifications...</p>
        </div>
      </div>
    );
  }

  if (!specs) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Monitor className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Device Specs Checker</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Complete device and browser information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={detectDeviceSpecs}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={exportSpecs}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="text-blue-600 dark:text-blue-400" size={24} />
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">DEVICE</div>
          </div>
          <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{specs.system.deviceType}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">{specs.system.os}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-2">
            <Chrome className="text-purple-600 dark:text-purple-400" size={24} />
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">BROWSER</div>
          </div>
          <div className="text-xl font-bold text-purple-900 dark:text-purple-100">{specs.browser.name}</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">v{specs.browser.version}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="text-green-600 dark:text-green-400" size={24} />
            <div className="text-xs font-medium text-green-600 dark:text-green-400">DISPLAY</div>
          </div>
          <div className="text-xl font-bold text-green-900 dark:text-green-100">{specs.screen.width} × {specs.screen.height}</div>
          <div className="text-sm text-green-700 dark:text-green-300">{specs.screen.pixelRatio}x Ratio</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="text-orange-600 dark:text-orange-400" size={24} />
            <div className="text-xs font-medium text-orange-600 dark:text-orange-400">CPU</div>
          </div>
          <div className="text-xl font-bold text-orange-900 dark:text-orange-100">{specs.system.cores} Cores</div>
          <div className="text-sm text-orange-700 dark:text-orange-300">{specs.system.memory || 'N/A'} GB RAM</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'browser', label: 'Browser', icon: Chrome },
            { id: 'hardware', label: 'Hardware', icon: Cpu },
            { id: 'features', label: 'Features', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SpecItem icon={Smartphone} label="Device Type" value={specs.system.deviceType} />
                <SpecItem icon={Server} label="Operating System" value={specs.system.os} />
                <SpecItem icon={Chrome} label="Browser" value={`${specs.browser.name} ${specs.browser.version}`} />
                <SpecItem icon={Globe} label="Platform" value={specs.system.platform} />
                <SpecItem icon={Wifi} label="Online Status" value={specs.browser.onlineStatus} />
                <SpecItem icon={MapPin} label="Timezone" value={specs.time.timezone} />
                <SpecItem icon={Clock} label="Local Time" value={specs.time.localTime} />
                <SpecItem icon={Gauge} label="Network Type" value={specs.network.effectiveType} />
              </div>
            </div>
          )}

          {/* Browser Tab */}
          {activeTab === 'browser' && (
            <div className="space-y-4">
              <SpecItem icon={Chrome} label="Browser Name" value={specs.browser.name} />
              <SpecItem icon={Info} label="Version" value={specs.browser.version} />
              <SpecItem icon={Globe} label="Language" value={specs.browser.language} />
              <SpecItem icon={CheckCircle2} label="Cookies Enabled" value={specs.browser.cookiesEnabled} />
              <SpecItem icon={Wifi} label="Online" value={specs.browser.onlineStatus} />
              <SpecItem icon={Server} label="Platform" value={specs.browser.platform} />
              <div className="mt-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">User Agent</div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                    {specs.browser.userAgent}
                  </div>
                  <button
                    onClick={() => copyToClipboard(specs.browser.userAgent, 'User Agent')}
                    className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {copiedItem === 'User Agent' ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copiedItem === 'User Agent' ? 'Copied!' : 'Copy User Agent'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hardware Tab */}
          {activeTab === 'hardware' && (
            <div className="space-y-4">
              <SpecItem icon={Cpu} label="CPU Cores" value={specs.system.cores} />
              <SpecItem icon={MemoryStick} label="Device Memory" value={`${specs.system.memory || 'N/A'} GB`} />
              <SpecItem icon={Monitor} label="Screen Resolution" value={`${specs.screen.width} × ${specs.screen.height}px`} />
              <SpecItem icon={Eye} label="Available Screen" value={`${specs.screen.availWidth} × ${specs.screen.availHeight}px`} />
              <SpecItem icon={Gauge} label="Pixel Ratio" value={`${specs.screen.pixelRatio}x`} />
              <SpecItem icon={Smartphone} label="Color Depth" value={`${specs.screen.colorDepth}-bit`} />
              <SpecItem icon={Monitor} label="Orientation" value={specs.screen.orientation} />
              <SpecItem icon={Fingerprint} label="Touch Support" value={specs.screen.touchSupport} />
              <SpecItem icon={MemoryStick} label="JS Heap Size" value={specs.performance.jsHeapSize} />
              <SpecItem icon={HardDrive} label="JS Heap Limit" value={specs.performance.jsHeapSizeLimit} />
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Storage & APIs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <SpecItem icon={HardDrive} label="LocalStorage" value={specs.features.localStorage} />
                  <SpecItem icon={HardDrive} label="SessionStorage" value={specs.features.sessionStorage} />
                  <SpecItem icon={Server} label="Service Worker" value={specs.features.serviceWorker} />
                  <SpecItem icon={Zap} label="WebGL" value={specs.features.webGL} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Media & Hardware</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <SpecItem icon={Camera} label="Camera Access" value={specs.features.camera} />
                  <SpecItem icon={Camera} label="Microphone Access" value={specs.features.microphone} />
                  <SpecItem icon={Bluetooth} label="Bluetooth API" value={specs.features.bluetooth} />
                  <SpecItem icon={MapPin} label="Geolocation" value={specs.features.geolocation} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Communication</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <SpecItem icon={Zap} label="WebRTC" value={specs.features.webRTC} />
                  <SpecItem icon={Info} label="Notifications" value={specs.features.notifications} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Network</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <SpecItem icon={Wifi} label="Connection Type" value={specs.network.effectiveType} />
                  <SpecItem icon={Gauge} label="Downlink Speed" value={`${specs.network.downlink} Mbps`} />
                  <SpecItem icon={Clock} label="Round Trip Time" value={`${specs.network.rtt} ms`} />
                  <SpecItem icon={Battery} label="Data Saver" value={specs.network.saveData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl p-6">
        <h5 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
          <Info size={20} />
          About Device Information
        </h5>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-indigo-800 dark:text-indigo-300">
          <div className="flex items-start gap-2">
            <Zap size={16} className="mt-0.5 flex-shrink-0" />
            <span>All detection is done locally in your browser</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
            <span>No data is sent to any server</span>
          </div>
          <div className="flex items-start gap-2">
            <Download size={16} className="mt-0.5 flex-shrink-0" />
            <span>Export your specs as JSON for records</span>
          </div>
          <div className="flex items-start gap-2">
            <RefreshCw size={16} className="mt-0.5 flex-shrink-0" />
            <span>Refresh to get updated information</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSpecsChecker;
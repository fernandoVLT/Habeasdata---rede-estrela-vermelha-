import React, { useState, useEffect, useMemo } from 'react';
import { Map, Overlay } from 'pigeon-maps';
import { MapCategory, MapPoint } from '../types';
import { MAP_POINTS } from '../constants';
import { MapPin, Users, Flag, HeartHandshake, Tent, Plus, Minus, AlertCircle } from 'lucide-react';

interface MapVizProps {
  focusLocation?: { lat: number; lng: number; zoom: number } | null;
}

const getIcon = (category: MapCategory, isLive?: boolean) => {
  if (isLive) return <AlertCircle size={20} className="text-white animate-pulse" />;
  switch (category) {
    case MapCategory.MST_COMMUNITY: return <Tent size={18} className="text-white" />;
    case MapCategory.LEADERSHIP: return <Users size={18} className="text-white" />;
    case MapCategory.DONATION: return <HeartHandshake size={18} className="text-white" />;
    case MapCategory.MEETING_POINT: return <MapPin size={18} className="text-white" />;
    case MapCategory.EVENT: return <Flag size={18} className="text-white" />;
    default: return <Flag size={18} className="text-white" />;
  }
};

const getColor = (category: MapCategory, isLive?: boolean) => {
  if (isLive) return 'bg-red-600 border-red-800';
  switch (category) {
    case MapCategory.MST_COMMUNITY: return 'bg-green-700 border-green-900';
    case MapCategory.LEADERSHIP: return 'bg-red-600 border-red-800';
    case MapCategory.DONATION: return 'bg-yellow-500 border-yellow-700';
    case MapCategory.MEETING_POINT: return 'bg-blue-500 border-blue-700';
    case MapCategory.EVENT: return 'bg-orange-500 border-orange-700';
    default: return 'bg-gray-500';
  }
};

// Safe wrapper for Overlay children to prevent pigeon-maps from passing internal props to DOM elements
/* eslint-disable @typescript-eslint/no-unused-vars */
const SafeOverlayChild = ({ children, latLngToPixel, pixelToLatLng, setCenterZoom, mapProps, mapState, left, top, ...rest }: any) => {
  // We explicitly extract pigeon-maps internal props and only spread the rest (like style) to the div
  return <div {...rest}>{children}</div>;
};

// Memoized Marker Component to prevent unnecessary re-renders
const MapMarker = React.memo(({ point, isActive, onClick, latLngToPixel, pixelToLatLng, setCenterZoom, mapProps, mapState, left, top, ...rest }: any) => {
  // We explicitly extract pigeon-maps internal props and only spread the rest (like style) to the div
  return (
    <div 
      {...rest}
      className={`relative group cursor-pointer transform transition-transform duration-300 ${isActive ? 'z-50 scale-125' : 'z-10 hover:scale-110 hover:z-40'}`}
      onClick={() => onClick(point)}
    >
      {/* Live Pulsing Effect - Optimized */}
      {point.isLive && (
        <>
          <div className="absolute top-0 left-0 w-10 h-10 bg-red-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -inset-2 bg-red-500 rounded-full blur-md opacity-40 animate-pulse"></div>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap animate-bounce">
             AO VIVO
          </div>
        </>
      )}

      {/* Pin Shape */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg ${getColor(point.category, point.isLive)} text-white relative z-10`}>
         {getIcon(point.category, point.isLive)}
      </div>
      {/* Triangle at bottom */}
      <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${getColor(point.category, point.isLive).replace('bg-', 'border-t-').split(' ')[0]}`}></div>
      
      {/* Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
        {point.title}
      </div>
    </div>
  );
});

export const MapViz: React.FC<MapVizProps> = ({ focusLocation }) => {
  const [selectedCategory, setSelectedCategory] = useState<MapCategory | 'ALL'>('ALL');
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  
  // Center of Betim, MG
  const [center, setCenter] = useState<[number, number]>([-19.9678, -44.1986]);
  const [zoom, setZoom] = useState(13);

  // Update map when focusLocation prop changes (from external redirect)
  useEffect(() => {
    if (focusLocation) {
      const newCenter: [number, number] = [focusLocation.lat, focusLocation.lng];
      if (newCenter[0] !== center[0] || newCenter[1] !== center[1]) {
        setCenter(newCenter);
      }
      if (focusLocation.zoom !== zoom) {
        setZoom(focusLocation.zoom);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusLocation]);

  const filteredPoints = useMemo(() => 
    selectedCategory === 'ALL' 
      ? MAP_POINTS 
      : MAP_POINTS.filter(p => p.category === selectedCategory),
  [selectedCategory]);

  // Provider function to use Google Maps Tiles
  const googleMapsProvider = (x: number, y: number, z: number, _dpr: number) => {
    return `https://mt0.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}`;
  };

  return (
    <div className="flex-1 flex flex-col h-screen border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mapa da Militância - Betim/MG</h2>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'ALL' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          {Object.values(MapCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 bg-slate-100 overflow-hidden">
        <Map 
          height="100%" 
          center={center} 
          zoom={zoom} 
          onBoundsChanged={({ center, zoom }) => { 
            setCenter(center); 
            setZoom(zoom);
          }}
          provider={googleMapsProvider}
          animate={true} // Enable smooth animation
        >
          {/* Custom Zoom Control */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-2">
            <button onClick={() => setZoom(Math.min(zoom + 1, 19))} className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 text-gray-700">
               <Plus size={20} />
            </button>
            <button onClick={() => setZoom(Math.max(zoom - 1, 1))} className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 text-gray-700">
               <Minus size={20} />
            </button>
          </div>

          {filteredPoints.map((point) => (
            <Overlay key={point.id} anchor={[point.lat, point.lng]} offset={[15, 30]}>
              <MapMarker 
                point={point} 
                isActive={activePoint?.id === point.id} 
                onClick={setActivePoint} 
              />
            </Overlay>
          ))}
          
          {/* Temporary Marker for focused Action/Event if coordinate is provided but not in LIST */}
          {focusLocation && (
             <Overlay anchor={[focusLocation.lat, focusLocation.lng]} offset={[15, 30]}>
                 <SafeOverlayChild>
                    <div className="animate-bounce">
                       <MapPin className="text-red-600 drop-shadow-lg" size={40} fill="currentColor" />
                    </div>
                 </SafeOverlayChild>
             </Overlay>
          )}

        </Map>

        {/* Active Point Modal/Card */}
        {activePoint && (
          <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-10 fade-in duration-300 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setActivePoint(null); }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getColor(activePoint.category, activePoint.isLive).split(' ')[0]} text-white shadow-sm`}>
                   {getIcon(activePoint.category, activePoint.isLive)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight flex items-center gap-2">
                    {activePoint.title}
                    {activePoint.isLive && <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded border border-red-200">AO VIVO</span>}
                  </h3>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide mt-1 block">{activePoint.category}</span>
                </div>
              </div>
              
              <div className="mt-3 pl-1">
                 <p className="text-gray-600 text-sm leading-relaxed">{activePoint.description}</p>
                 <div className="mt-3 flex items-center text-gray-500 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <MapPin size={14} className="mr-2 text-red-500 flex-shrink-0" />
                    {activePoint.address}
                 </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm">
                  Ver Detalhes
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Traçar Rota
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
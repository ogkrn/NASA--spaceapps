"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { CandidateSite } from "@/lib/types";

interface PlanetaryGlobeProps {
  planet: "Moon" | "Mars";
  sites: CandidateSite[];
  selectedSiteId: string | null;
  onSelectSite: (site: CandidateSite) => void;
}

export const PlanetaryGlobe: React.FC<PlanetaryGlobeProps> = ({
  planet,
  sites,
  selectedSiteId,
  onSelectSite,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMoon = planet === "Moon";

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Stars Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 40;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x88aaff,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 3. Deterministic fallback texture, replaced by a real planetary map when available.
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (isMoon) {
        // Moon fallback texture
        ctx.fillStyle = "#8a94a6";
        ctx.fillRect(0, 0, 1024, 512);
        
        // Maria (dark basaltic plains)
        ctx.fillStyle = "#4a5364";
        for (let i = 0; i < 18; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * 1024,
            Math.random() * 512,
            Math.random() * 80 + 30,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Highlands & small impact craters
        for (let i = 0; i < 220; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          const r = Math.random() * 12 + 2;
          ctx.strokeStyle = "#cad5e2";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = "#2d3442";
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Mars fallback texture
        ctx.fillStyle = "#c2410c";
        ctx.fillRect(0, 0, 1024, 512);

        // Dark volcanic regions (Syrtis Major, Acidalia)
        ctx.fillStyle = "#7c2d12";
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * 1024,
            Math.random() * 512,
            Math.random() * 100 + 40,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Polar ice caps (White carbon dioxide/water ice)
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, 1024, 40); // North polar cap
        ctx.fillRect(0, 472, 1024, 40); // South polar cap
      }
    }

    const fallbackTexture = new THREE.CanvasTexture(canvas);
    const textureUrl = isMoon
      ? "https://threejs.org/examples/textures/planets/moon_1024.jpg"
      : "https://threejs.org/examples/textures/planets/mars_1k_color.jpg";

    // 4. Planet Mesh
    const planetRadius = 1.25;
    const sphereGeo = new THREE.SphereGeometry(planetRadius, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      roughness: 0.85,
      metalness: 0.05,
    });
    const planetMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(planetMesh);

    const textureLoader = new THREE.TextureLoader();
    let remoteTexture: THREE.Texture | null = null;
    textureLoader.load(
      textureUrl,
      (texture) => {
        remoteTexture = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        sphereMat.map = texture;
        sphereMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Keep the deterministic fallback when the external texture is unavailable.
      },
    );

    // 5. Atmosphere Glow Ring
    const atmosphereGeo = new THREE.SphereGeometry(planetRadius * 1.025, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: isMoon ? 0x67e8f9 : 0xfb923c,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 6. Site Markers (Pointers at Lat/Lon)
    const markerGroup = new THREE.Group();
    const markerMeshes: { mesh: THREE.Mesh; site: CandidateSite }[] = [];

    // Spherical to 3D Cartesian coordinates
    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    sites.forEach((site) => {
      const pos = latLonToVector3(site.latitude, site.longitude, planetRadius + 0.02);
      const isSelected = site.id === selectedSiteId;

      const markerGeo = new THREE.SphereGeometry(isSelected ? 0.045 : 0.028, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x22d3ee : isMoon ? 0x38bdf8 : 0xf97316,
      });

      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.userData = { siteId: site.id };

      // Add a small outward pulsing ring
      const ringGeo = new THREE.RingGeometry(0.04, 0.055, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x06b6d4 : 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.8 : 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.01));
      ring.lookAt(pos.clone().multiplyScalar(2));
      marker.add(ring);

      markerGroup.add(marker);
      markerMeshes.push({ mesh: marker, site });
    });

    scene.add(markerGroup);

    // Mission-control orbital tracks make the globe read as a live operations view.
    const orbitGroup = new THREE.Group();
    [1.52, 1.68].forEach((radius, index) => {
      const orbitCurve = new THREE.EllipseCurve(0, 0, radius, radius * (index ? 0.64 : 0.82), 0, Math.PI * 2);
      const orbitPoints = orbitCurve.getPoints(128).map((point) => new THREE.Vector3(point.x, 0, point.y));
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: isMoon ? 0x67e8f9 : 0xfb923c,
        transparent: true,
        opacity: index ? 0.28 : 0.48,
      });
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      orbit.rotation.x = index ? 0.62 : 0.3;
      orbit.rotation.z = index ? -0.28 : 0.18;
      orbitGroup.add(orbit);
    });
    scene.add(orbitGroup);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0x334155, 1.2);
    scene.add(ambientLight);

    // Directional sunlight
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.4);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    // 8. Interaction (Drag to Rotate & Click site)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0.0015;
    let rotationVelocityY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      planetMesh.rotation.y += deltaX * 0.006;
      markerGroup.rotation.y += deltaX * 0.006;
      planetMesh.rotation.x += deltaY * 0.006;
      markerGroup.rotation.x += deltaY * 0.006;
      rotationVelocityX = 0;
      rotationVelocityY = 0;
    };

    const onMouseUp = () => {
      isDragging = false;
      rotationVelocityX = 0.0012;
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children, true);
      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit.parent && hit.parent !== markerGroup) {
          hit = hit.parent as THREE.Mesh;
        }
        const siteId = hit.userData.siteId;
        const matched = sites.find((s) => s.id === siteId);
        if (matched) {
          onSelectSite(matched);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("click", onClick);

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        planetMesh.rotation.y += rotationVelocityX;
        markerGroup.rotation.y += rotationVelocityX;
        orbitGroup.rotation.y -= rotationVelocityX * 0.35;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("click", onClick);
      window.removeEventListener("resize", handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      fallbackTexture.dispose();
      remoteTexture?.dispose();
      orbitGroup.traverse((object) => {
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
    };
  }, [planet, sites, selectedSiteId, isMoon, onSelectSite]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden cyber-card border border-space-700/60 bg-gradient-to-b from-black via-space-950 to-space-950 flex flex-col">
      {/* 3D Header Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-space-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-space-700 text-xs font-mono text-slate-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>LIVE {planet.toUpperCase()} ORBITAL VIEW</span>
        <span className="text-slate-500">| Drag to rotate · Click nodes</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-[10px] font-mono text-slate-300 bg-black/60 px-2.5 py-1 rounded border border-space-800">
        <span className={`w-1.5 h-1.5 rounded-full ${isMoon ? "bg-cyan-400" : "bg-orange-400"} animate-pulse`} />
        REAL PLANET MAP · VISUAL REFERENCE
      </div>

      <div className="absolute bottom-4 left-4 z-10 text-[11px] font-mono text-slate-400 bg-black/70 px-2.5 py-1 rounded border border-space-800">
        Solar irradiance: {isMoon ? "1361 W/m²" : "590 W/m²"} · {sites.length} tracked nodes · Orbit tracks active
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactGA from 'react-ga4';
import { scenes } from './sceneData';
import './ShirubeExperience.css';

const ShirubeExperience = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [darkOverlayOpacity, setDarkOverlayOpacity] = useState(0);
  const [modalOpacity, setModalOpacity] = useState(0);
  const [modalScale, setModalScale] = useState(0.96);
  const [dissolveOpacity, setDissolveOpacity] = useState(0);
  const [chevronVisible, setChevronVisible] = useState(false);

  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const modalRef = useRef(null);
  const chevronTimerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  const resetChevronTimer = useCallback(() => {
    setChevronVisible(false);
    if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);
    chevronTimerRef.current = setTimeout(() => setChevronVisible(true), 2000);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setCurrentScene(0);
    setPhase('opening');
    setDarkOverlayOpacity(0);
    setModalOpacity(0);
    setModalScale(0.96);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('shirube-exp-warp-active');

    ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_open' });
    ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_scene_view', label: 'scene_0', value: 0 });

    requestAnimationFrame(() => {
      setDarkOverlayOpacity(1);
    });

    setTimeout(() => {
      setModalOpacity(1);
      setModalScale(1);
    }, 1200);

    setTimeout(() => {
      setPhase('open');
      document.body.classList.remove('shirube-exp-warp-active');
      resetChevronTimer();
    }, 2400);
  }, [resetChevronTimer]);

  const handleClose = useCallback(() => {
    if (phase !== 'open') return;
    setPhase('closing');
    setChevronVisible(false);
    if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);

    ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_close', label: `closed_at_scene_${currentScene}`, value: currentScene });

    setModalOpacity(0);
    setModalScale(0.96);

    setTimeout(() => {
      document.body.classList.add('shirube-exp-warp-closing');
      setDarkOverlayOpacity(0);
    }, 800);

    setTimeout(() => {
      document.body.classList.remove('shirube-exp-warp-closing');
      setIsOpen(false);
      setPhase('idle');
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    }, 1600);
  }, [phase, currentScene]);

  const handleNextScene = useCallback(() => {
    if (phase !== 'open' || currentScene >= 2) return;
    setPhase('dissolving');
    setChevronVisible(false);
    if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);

    setDissolveOpacity(1);

    setTimeout(() => {
      const next = currentScene + 1;
      setCurrentScene(next);
      if (contentRef.current) contentRef.current.scrollTop = 0;

      ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_scene_view', label: `scene_${next}`, value: next });
      if (next === 2) {
        ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_complete' });
      }
    }, 1000);

    setTimeout(() => {
      setDissolveOpacity(0);
    }, 1000);

    setTimeout(() => {
      setPhase('open');
      resetChevronTimer();
    }, 2000);
  }, [phase, currentScene, resetChevronTimer]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  useEffect(() => {
    return () => {
      if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);
    };
  }, []);

  const scene = scenes[currentScene];
  const titleId = `shirube-exp-title-${scene.id}`;

  const modal = isOpen
    ? createPortal(
        <>
          <div
            className="shirube-exp-dark-overlay"
            style={{
              opacity: darkOverlayOpacity,
              transition: phase === 'closing'
                ? 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 800ms'
                : 'opacity 1200ms cubic-bezier(0.7, 0, 0.84, 0)',
            }}
          />
          <div
            ref={modalRef}
            className="shirube-exp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={() => { if (phase === 'open') handleClose(); }}
            style={{
              opacity: modalOpacity,
              transform: `scale(${modalScale})`,
              transition: phase === 'closing'
                ? 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)'
                : 'opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1) 1200ms, transform 1200ms cubic-bezier(0.22, 1, 0.36, 1) 1200ms',
            }}
          >
            <div
              className="shirube-exp-bg"
              style={{ backgroundImage: `url(${scene.bgImage})` }}
            />
            <div className="shirube-exp-bg-overlay" />

            <div
              className="shirube-exp-dissolve"
              style={{
                opacity: dissolveOpacity,
                transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            <div
              ref={contentRef}
              className="shirube-exp-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id={titleId} className="shirube-exp-scene-title">
                {scene.title}
              </h2>
              <div className="shirube-exp-body">
                {scene.body.map((line, i) =>
                  line === '' ? (
                    <div key={i} className="shirube-exp-empty-line" />
                  ) : (
                    <p key={i}>{line}</p>
                  )
                )}
              </div>
            </div>

            {currentScene < 2 && (
              <button
                ref={firstFocusableRef}
                className={`shirube-exp-chevron ${chevronVisible ? 'visible' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextScene();
                }}
                aria-label="次のシーンへ"
              >
                <svg width="32" height="16" viewBox="0 0 32 16" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,2 16,14 30,2" />
                </svg>
              </button>
            )}
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <>
      <section className="shirube-exp-section">
        <p className="shirube-exp-lead">少しだけ覗いてみてください。</p>
        <div className="shirube-exp-trigger-wrap">
          <button
            ref={triggerRef}
            className="shirube-exp-trigger"
            onClick={handleOpen}
            aria-label="標で起きること、体験ポップアップを開く"
          >
            {'　標で起きること　'}
          </button>
          <span className="shirube-exp-trigger-line" aria-hidden="true" />
        </div>
      </section>
      {modal}
    </>
  );
};

export default ShirubeExperience;

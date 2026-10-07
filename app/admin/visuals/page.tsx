"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Video,
  Star,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  ExternalLink,
  Upload,
  ArrowRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";
import {
  HeroSlide,
  DesireZoneCard,
  ComparisonConfig,
  VideoHeroConfig,
  FeaturedProductVisuals,
} from "@/lib/store-visuals";
import { Review } from "@/lib/types";

export default function AdminVisualsPage() {
  const [activeTab, setActiveTab] = useState<
    "hero" | "careZones" | "comparison" | "videoHero" | "featured" | "reviews"
  >("hero");

  // Load from DataStore
  const [visuals, setVisuals] = useState(() => dataStore.getStoreVisuals());
  const [reviewsList, setReviewsList] = useState<Review[]>(() => dataStore.getReviews());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setVisuals(dataStore.getStoreVisuals());
      setReviewsList(dataStore.getReviews());
    });
    return unsub;
  }, []);

  // New Review Modal
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    userName: "",
    rating: 5,
    title: "",
    body: "",
    productId: dataStore.getProducts()[0]?.id || "eb-prod-001",
    photoUrl: "",
  });

  const products = dataStore.getProducts();

  // Cloudinary Upload Handler
  const handleCloudinaryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
    fieldKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "ebl-pharmaceutical/store-visuals");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        callback(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image to Cloudinary");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveVisuals = () => {
    dataStore.updateStoreVisuals(visuals);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteReview = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this customer review?")) {
      dataStore.deleteReview(id);
      setReviewsList(dataStore.getReviews());
    }
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === newReviewForm.productId);
    const rev = dataStore.addReview({
      productId: newReviewForm.productId,
      productName: prod?.name || "EBL Formulation",
      userName: newReviewForm.userName.trim() || "Verified Patient",
      rating: newReviewForm.rating,
      title: newReviewForm.title.trim() || "Quality Pharmaceutical Formulation",
      body: newReviewForm.body.trim(),
      photos: newReviewForm.photoUrl
        ? [{ publicId: `rev-upload-${Date.now()}`, url: newReviewForm.photoUrl }]
        : undefined,
    });
    setReviewsList([rev, ...reviewsList]);
    setShowAddReviewModal(false);
    setNewReviewForm({
      userName: "",
      rating: 5,
      title: "",
      body: "",
      productId: products[0]?.id || "eb-prod-001",
      photoUrl: "",
    });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#0A1B8F]">
            Storefront Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Store Visuals &amp; Customer Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage all storefront banners, 3D product visual containers, video heroes, and genuine verified reviews with Cloudinary media integration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Shop</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={handleSaveVisuals}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0A1B8F] hover:bg-[#071369] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved &amp; Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "hero", label: "Hero Slideshow", icon: ImageIcon },
          { key: "careZones", label: "Therapeutic Care Zones", icon: Sparkles },
          { key: "comparison", label: "Comparison Slider", icon: Sliders },
          { key: "videoHero", label: "Video Hero", icon: Video },
          { key: "featured", label: "Featured Showcase", icon: Eye },
          { key: "reviews", label: `Customer Reviews (${reviewsList.length})`, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0A1B8F] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. HERO SLIDESHOW MANAGER */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Hero Slides ({visuals.heroSlides.length})
            </h2>
            <button
              onClick={() => {
                const newSlide: HeroSlide = {
                  id: `slide-${Date.now()}`,
                  title: "New EBL Formulation",
                  subtitle: "High-efficacy pharmaceutical therapeutic care",
                  desktopImage: "/images/products/ebl-raft-3d.jpg",
                  mobileImage: "/images/products/ebl-raft-3d.jpg",
                  link: "/shop/collections/gastro-care",
                  alt: "EBL Formulation",
                  badge: "CLINICAL PRECISION",
                  btnText: "Shop Formulation",
                };
                setVisuals({
                  ...visuals,
                  heroSlides: [...visuals.heroSlides, newSlide],
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visuals.heroSlides.map((slide: HeroSlide, idx: number) => (
              <div
                key={slide.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 relative"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-extrabold text-[#0A1B8F] bg-blue-50 px-2.5 py-1 rounded-full">
                    Slide #{idx + 1}
                  </span>
                  {visuals.heroSlides.length > 1 && (
                    <button
                      onClick={() => {
                        const updated = visuals.heroSlides.filter((_, i) => i !== idx);
                        setVisuals({ ...visuals, heroSlides: updated });
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Image Preview Container (Zero white border, perfectly fitted) */}
                <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 relative border border-slate-200 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.desktopImage}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono px-2 py-0.5 rounded">
                    Aspect: 21:9
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Badge</label>
                    <input
                      type="text"
                      value={slide.badge || ""}
                      onChange={(e) => {
                        const updated = [...visuals.heroSlides];
                        updated[idx].badge = e.target.value;
                        setVisuals({ ...visuals, heroSlides: updated });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Headline</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => {
                        const updated = [...visuals.heroSlides];
                        updated[idx].title = e.target.value;
                        setVisuals({ ...visuals, heroSlides: updated });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) => {
                        const updated = [...visuals.heroSlides];
                        updated[idx].subtitle = e.target.value;
                        setVisuals({ ...visuals, heroSlides: updated });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-xl"
                    />
                  </div>

                  {/* Cloudinary Upload for Desktop Banner */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Banner Image URL (Cloudinary or Local)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={slide.desktopImage}
                        onChange={(e) => {
                          const updated = [...visuals.heroSlides];
                          updated[idx].desktopImage = e.target.value;
                          setVisuals({ ...visuals, heroSlides: updated });
                        }}
                        className="flex-1 p-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                      />
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingField === `slide-${idx}` ? "Uploading..." : "Upload"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleCloudinaryUpload(
                              e,
                              (url) => {
                                const updated = [...visuals.heroSlides];
                                updated[idx].desktopImage = url;
                                updated[idx].mobileImage = url;
                                setVisuals({ ...visuals, heroSlides: updated });
                              },
                              `slide-${idx}`
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Button Text</label>
                      <input
                        type="text"
                        value={slide.btnText || ""}
                        onChange={(e) => {
                          const updated = [...visuals.heroSlides];
                          updated[idx].btnText = e.target.value;
                          setVisuals({ ...visuals, heroSlides: updated });
                        }}
                        className="w-full p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Link Target</label>
                      <input
                        type="text"
                        value={slide.link}
                        onChange={(e) => {
                          const updated = [...visuals.heroSlides];
                          updated[idx].link = e.target.value;
                          setVisuals({ ...visuals, heroSlides: updated });
                        }}
                        className="w-full p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. THERAPEUTIC CARE ZONES */}
      {activeTab === "careZones" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            Therapeutic Care Zones (Desire Zone Cards)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {visuals.desireZone.map((card, idx) => (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Zone #{idx + 1}
                </span>

                {/* Circular Preview Container */}
                <div className="w-36 h-36 mx-auto rounded-full bg-slate-900 overflow-hidden relative border-2 border-slate-200 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Zone Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...visuals.desireZone];
                        updated[idx].title = e.target.value;
                        setVisuals({ ...visuals, desireZone: updated });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subtitle / Badge</label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => {
                        const updated = [...visuals.desireZone];
                        updated[idx].subtitle = e.target.value;
                        setVisuals({ ...visuals, desireZone: updated });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      3D Visual Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={card.image}
                        onChange={(e) => {
                          const updated = [...visuals.desireZone];
                          updated[idx].image = e.target.value;
                          setVisuals({ ...visuals, desireZone: updated });
                        }}
                        className="flex-1 p-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                      />
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleCloudinaryUpload(
                              e,
                              (url) => {
                                const updated = [...visuals.desireZone];
                                updated[idx].image = url;
                                setVisuals({ ...visuals, desireZone: updated });
                              },
                              `zone-${idx}`
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Collection Link</label>
                    <input
                      type="text"
                      value={card.link}
                      onChange={(e) => {
                        const updated = [...visuals.desireZone];
                        updated[idx].link = e.target.value;
                        setVisuals({ ...visuals, desireZone: updated });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COMPARISON SLIDER */}
      {activeTab === "comparison" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900">
            Formulation Comparison Slider (Switch to EBL RAFT)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Headline</label>
              <input
                type="text"
                value={visuals.comparison.title}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    comparison: { ...visuals.comparison, title: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtitle</label>
              <input
                type="text"
                value={visuals.comparison.subtitle}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    comparison: { ...visuals.comparison, subtitle: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Before (Left) */}
            <div className="space-y-3">
              <label className="font-bold text-xs text-slate-800 block">
                Before Visual (Left Side)
              </label>
              <div className="w-full aspect-square rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-200 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visuals.comparison.beforeImage}
                  alt="Before visual"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <input
                type="text"
                value={visuals.comparison.beforeLabel}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    comparison: { ...visuals.comparison, beforeLabel: e.target.value },
                  })
                }
                placeholder="Before Label"
                className="w-full p-2 text-xs border border-slate-200 rounded-xl font-bold"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={visuals.comparison.beforeImage}
                  onChange={(e) =>
                    setVisuals({
                      ...visuals,
                      comparison: { ...visuals.comparison, beforeImage: e.target.value },
                    })
                  }
                  className="flex-1 p-2 text-xs font-mono border border-slate-200 rounded-xl"
                />
                <label className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleCloudinaryUpload(
                        e,
                        (url) =>
                          setVisuals({
                            ...visuals,
                            comparison: { ...visuals.comparison, beforeImage: url },
                          }),
                        "comp-before"
                      )
                    }
                  />
                </label>
              </div>
            </div>

            {/* After (Right) */}
            <div className="space-y-3">
              <label className="font-bold text-xs text-slate-800 block">
                After Visual (Right Side)
              </label>
              <div className="w-full aspect-square rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-200 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visuals.comparison.afterImage}
                  alt="After visual"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <input
                type="text"
                value={visuals.comparison.afterLabel}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    comparison: { ...visuals.comparison, afterLabel: e.target.value },
                  })
                }
                placeholder="After Label"
                className="w-full p-2 text-xs border border-slate-200 rounded-xl font-bold"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={visuals.comparison.afterImage}
                  onChange={(e) =>
                    setVisuals({
                      ...visuals,
                      comparison: { ...visuals.comparison, afterImage: e.target.value },
                    })
                  }
                  className="flex-1 p-2 text-xs font-mono border border-slate-200 rounded-xl"
                />
                <label className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleCloudinaryUpload(
                        e,
                        (url) =>
                          setVisuals({
                            ...visuals,
                            comparison: { ...visuals.comparison, afterImage: url },
                          }),
                        "comp-after"
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIDEO HERO */}
      {activeTab === "videoHero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900">
            Video Hero Banner Configuration
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Badge Text</label>
              <input
                type="text"
                value={visuals.videoHero.badge}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    videoHero: { ...visuals.videoHero, badge: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Main Heading</label>
              <input
                type="text"
                value={visuals.videoHero.heading}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    videoHero: { ...visuals.videoHero, heading: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-base"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Supporting Text</label>
              <textarea
                rows={3}
                value={visuals.videoHero.subtext}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    videoHero: { ...visuals.videoHero, subtext: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Video Stream URL (MP4)</label>
              <input
                type="text"
                value={visuals.videoHero.videoUrl}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    videoHero: { ...visuals.videoHero, videoUrl: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Poster Image URL (Cloudinary or Local)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={visuals.videoHero.posterUrl}
                  onChange={(e) =>
                    setVisuals({
                      ...visuals,
                      videoHero: { ...visuals.videoHero, posterUrl: e.target.value },
                    })
                  }
                  className="flex-1 p-2.5 border border-slate-200 rounded-xl font-mono"
                />
                <label className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleCloudinaryUpload(
                        e,
                        (url) =>
                          setVisuals({
                            ...visuals,
                            videoHero: { ...visuals.videoHero, posterUrl: url },
                          }),
                        "video-poster"
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Button Label</label>
                <input
                  type="text"
                  value={visuals.videoHero.buttonText}
                  onChange={(e) =>
                    setVisuals({
                      ...visuals,
                      videoHero: { ...visuals.videoHero, buttonText: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Button Link</label>
                <input
                  type="text"
                  value={visuals.videoHero.buttonLink}
                  onChange={(e) =>
                    setVisuals({
                      ...visuals,
                      videoHero: { ...visuals.videoHero, buttonLink: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FEATURED PRODUCT SHOWCASE */}
      {activeTab === "featured" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900">
            Featured Product Showcase Configuration
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Featured Product to Highlight
              </label>
              <select
                value={visuals.featuredProduct.productId}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    featuredProduct: {
                      ...visuals.featuredProduct,
                      productId: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Brand Tag</label>
              <input
                type="text"
                value={visuals.featuredProduct.brandTag}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    featuredProduct: {
                      ...visuals.featuredProduct,
                      brandTag: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Discount Badge</label>
              <input
                type="text"
                value={visuals.featuredProduct.discountBadge}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    featuredProduct: {
                      ...visuals.featuredProduct,
                      discountBadge: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Stock Status Text</label>
              <input
                type="text"
                value={visuals.featuredProduct.stockStatus}
                onChange={(e) =>
                  setVisuals({
                    ...visuals,
                    featuredProduct: {
                      ...visuals.featuredProduct,
                      stockStatus: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. CUSTOMER REVIEWS MANAGER */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Customer Reviews ({reviewsList.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage all genuine customer reviews. Add verified feedback or remove inappropriate entries.
              </p>
            </div>

            <button
              onClick={() => setShowAddReviewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#E11D48] hover:bg-[#C4153C] text-white rounded-full text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-[#E11D48] flex items-center justify-center font-bold text-xs border border-rose-100">
                      {rev.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {rev.productName || "Product"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">{rev.createdAt}</span>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? "fill-current text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <h4 className="font-bold text-xs text-slate-900">{rev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.body}</p>

                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.photos.map((ph, idx) => (
                      <div
                        key={idx}
                        className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ph.url}
                          alt="Review attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-slate-100 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Add Verified Customer Review</h3>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Product</label>
                <select
                  value={newReviewForm.productId}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, productId: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Reviewer Name</label>
                <input
                  type="text"
                  required
                  value={newReviewForm.userName}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, userName: e.target.value })
                  }
                  placeholder="e.g. Dr. Rajesh Sen, Kolkata"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewForm({ ...newReviewForm, rating: star })}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewForm.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newReviewForm.title}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, title: e.target.value })
                  }
                  placeholder="e.g. Highly effective and well tolerated"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Review Text</label>
                <textarea
                  rows={3}
                  required
                  value={newReviewForm.body}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, body: e.target.value })
                  }
                  placeholder="Enter detailed clinical or customer testimonial..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Optional Attached Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReviewForm.photoUrl}
                    onChange={(e) =>
                      setNewReviewForm({ ...newReviewForm, photoUrl: e.target.value })
                    }
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 outline-none font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleCloudinaryUpload(
                          e,
                          (url) => setNewReviewForm({ ...newReviewForm, photoUrl: url }),
                          "rev-modal-upload"
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="text-xs font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E11D48] hover:bg-[#C4153C] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  InstagramSlide1Hook,
  InstagramSlide2Result,
  InstagramSlide3Star,
  InstagramSlide4Proof
} from "@/components/instagram-story-card";
import {
  getLyfefuelStarParticipant,
  getLyfefuelActualAverages
} from "@/lib/lyfefuel-real-data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const starParticipant = getLyfefuelStarParticipant();
const actualAverages = getLyfefuelActualAverages();

export default function InstagramPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/verify/lyfefuel-results" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Results
        </Link>

        <h1 className="text-2xl font-bold mb-2">Instagram Carousel Preview</h1>
        <p className="text-muted-foreground mb-8">
          4-slide carousel format (1080x1350px each) - Warm, lifestyle design inspired by LYFEfuel brand
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Slide 1 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Slide 1: The Hook</h3>
            <div className="overflow-hidden rounded-lg shadow-lg" style={{ transform: "scale(0.4)", transformOrigin: "top left", width: 432, height: 540 }}>
              <InstagramSlide1Hook
                productName="LYFEfuel Daily Essentials"
                studyDuration={24}
                totalParticipants={actualAverages.totalParticipants}
                productImageUrl="/images/lyfefuel-product-lifestyle.png"
              />
            </div>
          </div>

          {/* Slide 2 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Slide 2: The Result</h3>
            <div className="overflow-hidden rounded-lg shadow-lg" style={{ transform: "scale(0.4)", transformOrigin: "top left", width: 432, height: 540 }}>
              <InstagramSlide2Result
                avgActivityChange={actualAverages.avgActivityChange}
                totalParticipants={actualAverages.totalParticipants}
              />
            </div>
          </div>

          {/* Slide 3 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Slide 3: Star Performer (Julie F.)</h3>
            <div className="overflow-hidden rounded-lg shadow-lg" style={{ transform: "scale(0.4)", transformOrigin: "top left", width: 432, height: 540 }}>
              <InstagramSlide3Star
                starParticipant={starParticipant}
                productImageUrl="/images/lyfefuel-product-lifestyle.png"
              />
            </div>
          </div>

          {/* Slide 4 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Slide 4: Transparency</h3>
            <div className="overflow-hidden rounded-lg shadow-lg" style={{ transform: "scale(0.4)", transformOrigin: "top left", width: 432, height: 540 }}>
              <InstagramSlide4Proof
                totalParticipants={actualAverages.totalParticipants}
                brandName="LYFEfuel"
                brandLogoUrl="/logos/lyfefuel-logo.png"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-4">Design Notes</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Color Palette:</span> Warm cream (#FDF8F3) and soft beige (#F5EDE6) backgrounds with teal (#00D1C1) as accent only</li>
            <li><span className="font-medium text-foreground">Typography:</span> Light weights, italics for emphasis, warm brown (#8B7355) for muted text</li>
            <li><span className="font-medium text-foreground">Messaging:</span> Aspirational ("Feel the difference") not clinical</li>
            <li><span className="font-medium text-foreground">Data:</span> +{actualAverages.avgActivityChange}% average activity increase, {actualAverages.totalParticipants} participants</li>
            <li><span className="font-medium text-foreground">Star:</span> Julie F. with +176% steps, +126% activity, NPS 10</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

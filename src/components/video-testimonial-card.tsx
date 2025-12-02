"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MockTestimonial } from "@/lib/mock-data";
import { VerificationBadge } from "@/components/verification-page";
import { StoryCardActions } from "@/components/story-card-actions";
import {
  Star,
  Watch,
  BadgeCheck,
  Check,
  Video,
  Play,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
} from "lucide-react";

interface VideoTestimonialCardProps {
  testimonial: MockTestimonial;
  studyId: string;
  isFeatured?: boolean;
  onToggleFeatured?: () => void;
}

export function VideoTestimonialCard({ testimonial, studyId, isFeatured = false, onToggleFeatured }: VideoTestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDownloadVideo = () => {
    // In production, this would trigger an actual download
    // For now, we'll just show an alert or open the video URL
    if (testimonial.videoUrl) {
      window.open(testimonial.videoUrl, "_blank");
    }
  };

  const handleDownloadDataCard = () => {
    // In production, this would generate and download a PNG/PDF data card
    // For now, we'll just show a placeholder action
    alert(`Downloading data card for ${testimonial.participant}...`);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={`overflow-hidden transition-colors ${isFeatured ? "border-yellow-500/50 ring-1 ring-yellow-500/20" : "hover:border-[#00D1C1]/50"}`}>
        {/* Card Header with Verified Badge */}
        <div className="bg-gradient-to-r from-[#00D1C1]/10 to-transparent p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                <span className="font-semibold text-[#00D1C1]">{testimonial.initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{testimonial.participant}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    {testimonial.age} · {testimonial.location}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Watch className="h-3 w-3" />
                  <span>{testimonial.device}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Feature Star Toggle */}
              {onToggleFeatured && (
                <button
                  onClick={onToggleFeatured}
                  className={`p-1.5 rounded-full transition-colors ${
                    isFeatured
                      ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-yellow-500"
                  }`}
                  title={isFeatured ? "Remove from featured" : "Add to featured widgets"}
                >
                  <Star className={`h-4 w-4 ${isFeatured ? "fill-yellow-500" : ""}`} />
                </button>
              )}
              {/* Video Available Badge */}
              {testimonial.hasVideo && (
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium hover:bg-purple-500/20 transition-colors cursor-pointer">
                    <Video className="h-3.5 w-3.5" />
                    Video
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </CollapsibleTrigger>
              )}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Expandable Video Section */}
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="mb-4 space-y-3">
              {/* Video Player / Thumbnail */}
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                {isPlaying ? (
                  // In production, this would be an actual video element
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <video
                      src={testimonial.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      onEnded={() => setIsPlaying(false)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <>
                    {testimonial.videoThumbnail ? (
                      <img
                        src={testimonial.videoThumbnail}
                        alt={`${testimonial.participant} video thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                    >
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-7 w-7 text-gray-900 ml-1" />
                      </div>
                    </button>
                    {/* Duration Badge */}
                    {testimonial.videoDuration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                        {testimonial.videoDuration}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Download Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleDownloadVideo}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleDownloadDataCard}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Data Card
                </Button>
              </div>
            </div>
          </CollapsibleContent>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(testimonial.overallRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{testimonial.overallRating}</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            {testimonial.metrics.map((metric) => (
              <div key={metric.label} className="p-2 rounded-lg bg-[#00D1C1]/10 text-center">
                <p className="text-lg font-bold text-[#00D1C1]">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-1">
            {testimonial.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-[#00D1C1]">
            <p className="text-sm italic">&quot;{testimonial.story}&quot;</p>
          </div>

          {/* Verification Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Link href={`/verify/${testimonial.verificationId}`}>
              <VerificationBadge verificationId={testimonial.verificationId} />
            </Link>
            <StoryCardActions testimonial={testimonial} studyId={studyId} />
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  );
}

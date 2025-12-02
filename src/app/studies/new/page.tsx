"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { StudyPreview } from "@/components/study-preview";
import { useStudyForm } from "@/lib/study-context";

const categories = [
  "Sleep",
  "Stress",
  "Energy",
  "Recovery",
  "Fitness",
  "Nutrition",
  "Skin",
];

export default function CreateStudyStep1() {
  const router = useRouter();
  const { formData, updateField } = useStudyForm();

  const descriptionLength = formData.productDescription.length;
  const maxDescriptionLength = 500;

  const handleContinue = () => {
    router.push("/studies/new/settings");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-medium text-muted-foreground">
              Step 1 of 3: Product Info
            </h1>
            <span className="text-sm text-muted-foreground">33%</span>
          </div>
          <Progress value={33} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Form Section - 60% */}
          <div className="flex-[3]">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Tell us about your product
                </h2>

                <div className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="e.g. Sensate Relaxation Device"
                      value={formData.productName}
                      onChange={(e) => updateField("productName", e.target.value)}
                    />
                  </div>

                  {/* Product Image */}
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <ImageUpload
                      value={formData.productImage}
                      onChange={(value) => updateField("productImage", value)}
                    />
                  </div>

                  {/* Product Description */}
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Product Description</Label>
                    <Textarea
                      id="productDescription"
                      placeholder="Briefly describe what your product does and its main benefits..."
                      value={formData.productDescription}
                      onChange={(e) =>
                        updateField(
                          "productDescription",
                          e.target.value.slice(0, maxDescriptionLength)
                        )
                      }
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {descriptionLength}/{maxDescriptionLength} characters
                    </p>
                  </div>

                  {/* Product Price */}
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Product Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="productPrice"
                        type="text"
                        inputMode="decimal"
                        placeholder="299.00"
                        value={formData.productPrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          updateField("productPrice", value);
                        }}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  {/* Product URL */}
                  <div className="space-y-2">
                    <Label htmlFor="productUrl">Product URL (optional)</Label>
                    <Input
                      id="productUrl"
                      type="url"
                      placeholder="https://yoursite.com/product"
                      value={formData.productUrl}
                      onChange={(e) => updateField("productUrl", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll use this to help generate study content
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => updateField("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="ghost" asChild>
                    <Link href="/studies">Cancel</Link>
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
                  >
                    Continue to Study Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section - 40% */}
          <div className="flex-[2]">
            <div className="sticky top-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Live Preview
              </h3>
              <StudyPreview
                productName={formData.productName}
                productImage={formData.productImage}
                category={formData.category}
                rebateAmount={formData.rebateAmount}
                durationDays={formData.durationDays}
                totalSpots={formData.totalSpots}
                requiredDevice={formData.requiredDevice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

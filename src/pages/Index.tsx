import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Sparkles, RotateCcw, Target, BookOpen, Lightbulb } from "lucide-react";

const formSchema = z.object({
  interests: z.string().trim().min(1, "Please enter your interests").max(500),
  degree: z.string().min(1, "Please select your degree"),
  cgpa: z.coerce
    .number()
    .min(0, "CGPA must be at least 0.0")
    .max(4, "CGPA must be at most 4.0"),
  careerGoal: z.string().trim().min(1, "Please enter your career goal").max(300),
});

type FormValues = z.infer<typeof formSchema>;

interface Career {
  title: string;
  description: string;
  relevance: "High" | "Medium" | "Low";
}

interface Recommendations {
  careers: Career[];
  skills: string[];
  advice: string;
}

const DEGREES = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Finance",
  "Marketing",
  "Economics",
  "Psychology",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Arts & Design",
  "Communications",
  "Education",
  "Other",
];

const relevanceColor: Record<string, string> = {
  High: "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700",
  Medium: "bg-amber-500/15 text-amber-700 border-amber-300 dark:text-amber-400 dark:border-amber-700",
  Low: "bg-rose-500/15 text-rose-700 border-rose-300 dark:text-rose-400 dark:border-rose-700",
};

const Index = () => {
  const [results, setResults] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { interests: "", degree: "", cgpa: undefined as any, careerGoal: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("career-advisor", {
        body: values,
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      setResults(data as Recommendations);
    } catch (e) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Career & Education Advisor
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Intro */}
        <section className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Discover Your Ideal Career Path
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your academic profile and interests to receive AI-powered career suggestions, skill recommendations, and personalized guidance.
          </p>
        </section>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" /> Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. fastapi, nodejs, docker, cloud, machine learning"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your degree" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEGREES.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cgpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA (0.0 – 4.0)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            max={4}
                            placeholder="e.g. 3.5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="careerGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career Goal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. become a data scientist"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={loading} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {loading ? "Analyzing…" : "Get Recommendation"}
                  </Button>
                  {(results || form.formState.isDirty) && (
                    <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
                      <RotateCcw className="h-4 w-4" /> Start Over
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-5 w-40" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Careers */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Target className="h-5 w-5 text-primary" /> Career Suggestions
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {results.careers.map((career, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-2">
                      <h4 className="font-semibold text-foreground">{career.title}</h4>
                      <p className="text-sm text-muted-foreground">{career.description}</p>
                      <Badge
                        variant="outline"
                        className={relevanceColor[career.relevance]}
                      >
                        {career.relevance} Relevance
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Skills */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <BookOpen className="h-5 w-5 text-primary" /> Skills to Learn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advice */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <Lightbulb className="h-5 w-5 text-primary" /> AI Advice
                </h3>
                <p className="text-muted-foreground leading-relaxed">{results.advice}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

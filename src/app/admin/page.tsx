import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, UserCog, BookText, School, ArrowRight } from "lucide-react";
import { students, teachers, subjects, classes } from "@/lib/mock-data";

const overviewItems = [
  {
    title: "Students",
    count: students.length,
    icon: Users,
    href: "/admin/students",
    description: "Manage student profiles and enrollment."
  },
  {
    title: "Teachers",
    count: teachers.length,
    icon: UserCog,
    href: "/admin/teachers",
    description: "Manage teacher accounts and assignments."
  },
  {
    title: "Subjects",
    count: subjects.length,
    icon: BookText,
    href: "/admin/subjects",
    description: "Define courses and subject matter."
  },
  {
    title: "Classes",
    count: classes.length,
    icon: School,
    href: "/admin/classes",
    description: "Assign teachers and students to classes."
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-6 font-headline">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewItems.map(item => (
          <Link href={item.href} key={item.title}>
            <Card className="hover:bg-muted/50 transition-colors group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.count}</div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <div className="flex items-center text-sm text-primary font-semibold pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Manage</span>
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

       <div className="mt-8">
        <h3 className="text-2xl font-bold tracking-tight mb-4 font-headline">Recent Activity</h3>
         <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No recent activity to display. As you manage your school's data, updates will appear here.</p>
            </CardContent>
         </Card>
       </div>
    </div>
  );
}

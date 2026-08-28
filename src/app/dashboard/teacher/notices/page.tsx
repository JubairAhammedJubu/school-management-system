import NoticeBoard from "@/components/NoticeBoard/NoticeBoard";

export default function TeacherNoticesPage() {
  return (
    <NoticeBoard
      title="Teacher Notice Board"
      subtitle="Stay up-to-date with official academic notices, exam schedules, and institutional announcements."
      showCreateButton={true}
    />
  );
}

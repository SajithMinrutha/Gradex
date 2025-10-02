// src/pages/SubjectPage.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CenterArea from "../components/CenterArea";
import Card from "../components/Card";
import { supabase } from "../supabaseClient";

export default function SubjectPage() {
  const { subject } = useParams();
  const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only marks for this subject
  const fetchMarks = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setMarks([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("marks")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject", capitalizedSubject)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching marks:", error.message);
      setMarks([]);
    } else {
      setMarks(data || []);
    }
    setLoading(false);
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchMarks();
    const interval = setInterval(fetchMarks, 5000);
    return () => clearInterval(interval);
  }, [subject]);

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 sm:mb-4">
        {capitalizedSubject}
      </h1>
      <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
        Your {capitalizedSubject} marks and progress.
      </p>

      <Card className="w-full overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
          {capitalizedSubject} Progress
        </h2>

        <div className="w-full">
          <CenterArea
            subject={capitalizedSubject}
            showStats={true}
            chartHeight={350}
            marks={marks} // pass filtered marks
          />
        </div>
      </Card>
    </div>
  );
}

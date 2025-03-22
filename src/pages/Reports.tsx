import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Ensure the path to your Firebase config is correct

export function Reports() {
  const [projects, setProjects] = useState([]);
  const [ratings, setRatings] = useState([]);

  // Fetch projects from Firestore
  const fetchProjects = async () => {
    const projectCollection = collection(db, "projects");
    const projectSnapshot = await getDocs(projectCollection);
    const projectList = projectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectList);
  };

  // Fetch ratings from Firestore
  const fetchRatings = async () => {
    const ratingsCollection = collection(db, "ratings");
    const ratingsSnapshot = await getDocs(ratingsCollection);
    const ratingsList = ratingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRatings(ratingsList);
  };

  useEffect(() => {
    fetchProjects();
    fetchRatings();
  }, []);

  // Function to calculate average score for a project
  const getProjectAverageScore = (projectId) => {
    const projectRatings = ratings.filter((r) => r.projectId === projectId);

    // Group ratings by judge
    const scoresByJudge = projectRatings.reduce((acc, curr) => {
      if (!acc[curr.judgeId]) {
        acc[curr.judgeId] = [];
      }
      acc[curr.judgeId].push(curr.score);
      return acc;
    }, {});

    // Calculate average score for each judge
    const judgeAverages = Object.values(scoresByJudge).map((scores) => {
      const total = scores.reduce((sum, score) => sum + score, 0);
      return total / scores.length;
    });

    // Overall average score across judges
    const overallAverage =
      judgeAverages.reduce((sum, avg) => sum + avg, 0) /
      (judgeAverages.length || 1);

    return overallAverage.toFixed(1); // Return a rounded average
  };

  // Sort projects by average score
  const sortedProjects = [...projects].sort((a, b) => {
    const aScore = Number(getProjectAverageScore(a.id));
    const bScore = Number(getProjectAverageScore(b.id));
    return bScore - aScore; // Sort descending by score
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Project Rankings</h1>

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Leaderboard</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Team Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProjects.map((project, index) => {
                const averageScore = getProjectAverageScore(project.id);
                return (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.teamName || "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

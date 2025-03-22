import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Adds or updates a rating entry in the Firestore `ratings` collection.
 * @param {Object} rating - The rating data to be saved.
 * @param {string} rating.projectId - The ID of the project being rated.
 * @param {string} rating.judgeEmail - The email of the judge submitting the rating.
 * @param {number} rating.impact - The score for the "Impact" criterion.
 * @param {number} rating.innovation - The score for the "Innovation" criterion.
 * @param {number} rating.feasibility - The score for the "Feasibility" criterion.
 * @param {number} rating.presentation - The score for the "Presentation Skills" criterion.
 * @returns {Promise<void>} - A promise that resolves when the rating is added or updated successfully.
 */
export async function addOrUpdateRating({
  projectId,
  judgeEmail,
  impact,
  innovation,
  feasibility,
  presentation,
}: {
  projectId: string;
  judgeEmail: string;
  impact: number;
  innovation: number;
  feasibility: number;
  presentation: number;
}): Promise<void> {
  try {
    // Create a unique document ID based on project and judge
    const ratingId = `${projectId}_${judgeEmail}`;
    const ratingRef = doc(db, "ratings", ratingId);

    // Calculate the total score
    const scoreSum = impact + innovation + feasibility + presentation;

    // Check if the document exists
    const existingDoc = await getDoc(ratingRef);

    if (!existingDoc.exists()) {
      // Create a new document if it doesn't exist
      await setDoc(ratingRef, {
        projectId,
        judgeEmail,
        impact,
        innovation,
        feasibility,
        presentation,
        scoreSum,
        timestamp: serverTimestamp(),
      });
    } else {
      // Update existing document
      await updateDoc(ratingRef, {
        impact,
        innovation,
        feasibility,
        presentation,
        scoreSum,
        timestamp: serverTimestamp(),
      });
    }

    console.log("Rating added or updated successfully!");
  } catch (error) {
    console.error("Error adding or updating rating:", error);
    throw error;
  }
}

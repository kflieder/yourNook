'use client'
import React from 'react'
import { useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

function TestFirebase() {
    useEffect(() => {
        async function fetchTestData() {
            try {
               const testCollectionRef = collection(db, 'test');
               const querySnapshot = await getDocs(testCollectionRef);
               console.log('firebase connected! docs:');
               querySnapshot.forEach((doc: any) => {
                    console.log(doc.id, "=>", doc.data());
               })
            } catch (error) {
               console.error('Error fetching test data:', error); 
            }
        }
        fetchTestData();
    }, [])
  return (
    <div>TestFirebase</div>
  )
}

export default TestFirebase
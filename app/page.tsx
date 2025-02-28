// app/page.tsx
'use client'; // ✅ Add this to make it a Client Component

import { Suspense, useState, useEffect } from 'react';
import UserSearch from './components/user-search';
import { UserDialog } from './components/user-dialog';
import { searchUsers } from './actions/actions';
import { User } from './actions/schemas';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData: User[] = await searchUsers(''); // Fetch all users initially
        setUsers(usersData || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  function TechnicalOverview() {
    return (
      <section className="mt-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">How it works</h2>
        <p className="text-gray-700">
          The search functionality is implemented using a server action, which searches an array of pre-populated user data. The AsyncSelect component sends the search query to the server action, which filters the users based on a <code>startsWith</code> matching logic. When a user is selected from the dropdown, their details are displayed in a card component.
        </p>
      </section>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Search</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserSearch users={users} />
      </Suspense>
      <UserDialog />
      <TechnicalOverview />
    </div>
  );
}

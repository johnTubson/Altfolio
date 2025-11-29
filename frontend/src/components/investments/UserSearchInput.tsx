import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { User } from "../../types";
import api from "../../utils/api";

interface UserSearchInputProps {
  selectedUserIds: string[];
  onToggleUser: (userId: string, user?: User) => void;
  selectedUsers: User[];
}

const searchUsersAPI = async (query: string): Promise<User[]> => {
  if (!query.trim()) return [];
  try {
    const response = await api.get<{ data: User[] }>(
      `/users/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to search users:", error);
    return [];
  }
};

export const UserSearchInput = ({
  selectedUserIds,
  onToggleUser,
  selectedUsers,
}: UserSearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback(async (query: string): Promise<void> => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true);
      const results = await searchUsersAPI(query);
      setSearchResults(results);
      setSearchLoading(false);
    }, 300);
  }, []);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      setSearchQuery(value);
      handleSearch(value);
    },
    [handleSearch]
  );

  const availableUsers = searchResults.filter((user) => {
    const userId = user._id || user.id;
    return userId && !selectedUserIds.includes(userId);
  });

  const selectedUsersList = selectedUsers.filter((user) => {
    const userId = user._id || user.id;
    return userId && selectedUserIds.includes(userId);
  });

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search users by name or email..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
      />
      {searchLoading && (
        <div className="text-sm text-gray-500 mb-2">Searching...</div>
      )}
      {selectedUserIds.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Selected Owners:
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedUsersList.map((user) => {
              const userId = (user._id || user.id) as string;
              return (
                <span
                  key={userId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {user.name} ({user.email})
                  <button
                    type="button"
                    onClick={() => onToggleUser(userId)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
      {searchQuery && !searchLoading && (
        <div className="max-h-48 overflow-y-auto p-3 border border-gray-300 rounded-md">
          {availableUsers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {availableUsers.map((user) => {
                const userId = (user._id || user.id) as string;
                if (!userId) return null;
                return (
                  <label
                    key={userId}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(userId)}
                      onChange={() => onToggleUser(userId, user)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-gray-700">
                      {user.name} ({user.email})
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-2">
              No users found
            </div>
          )}
        </div>
      )}
      {!searchQuery && (
        <div className="text-sm text-gray-500 p-3 border border-gray-300 rounded-md">
          Start typing to search for users...
        </div>
      )}
    </div>
  );
};

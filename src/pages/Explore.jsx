import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPublicCapsules } from '../store/slices/capsuleSlice';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Avatar from '../components/ui/Avatar';
import { formatRelativeTime, debounce } from '../utils/helpers';

const Explore = () => {
  const dispatch = useDispatch();
  const { publicCapsules, loading, publicPagination } = useSelector(
    (state) => state.capsules
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = debounce((search) => {
    dispatch(fetchPublicCapsules({ search, page: 1 }));
  }, 500);

  useEffect(() => {
    dispatch(fetchPublicCapsules());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      dispatch(fetchPublicCapsules({ page: 1 }));
    }
  }, [searchTerm, dispatch, debouncedSearch]);

  const handleLoadMore = async () => {
    if (publicPagination.page < publicPagination.pages) {
      setLoadingMore(true);
      await dispatch(
        fetchPublicCapsules({
          page: publicPagination.page + 1,
          search: searchTerm,
        })
      );
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Public Capsules
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing memory collections shared by the community. Join
            public capsules and contribute your own memories.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <Input
            placeholder="Search public capsules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { name: 'Travel', icon: '✈️', color: 'bg-blue-100 text-blue-800' },
            {
              name: 'Family',
              icon: '👨‍👩‍👧‍👦',
              color: 'bg-green-100 text-green-800',
            },
            {
              name: 'Events',
              icon: '🎉',
              color: 'bg-purple-100 text-purple-800',
            },
            {
              name: 'Nature',
              icon: '🌿',
              color: 'bg-emerald-100 text-emerald-800',
            },
          ].map((category) => (
            <button
              key={category.name}
              onClick={() => setSearchTerm(category.name.toLowerCase())}
              className={`p-4 rounded-lg text-center transition-colors hover:opacity-80 ${category.color}`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Capsules Grid */}
        {loading && publicCapsules.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : publicCapsules.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No public capsules found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or check back later
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {publicCapsules.map((capsule) => (
                <Link key={capsule._id} to={`/capsule/${capsule._id}`}>
                  <Card hover className="h-full">
                    {/* Cover Image */}
                    {capsule.coverImage && (
                      <img
                        src={capsule.coverImage || '/placeholder.svg'}
                        alt={capsule.title}
                        className="w-full h-48 object-cover rounded-t-lg -m-6 mb-4"
                      />
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {capsule.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {capsule.description}
                        </p>
                      </div>

                      {/* Tags */}
                      {capsule.tags && capsule.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {capsule.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                          {capsule.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{capsule.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>
                            {capsule.stats?.totalMemories || 0} memories
                          </span>
                          <span>
                            {capsule.stats?.totalContributors || 0} contributors
                          </span>
                        </div>
                        <span>{formatRelativeTime(capsule.createdAt)}</span>
                      </div>

                      {/* Owner */}
                      <div className="flex items-center space-x-2">
                        <Avatar
                          src={capsule.owner.avatarUrl}
                          alt={capsule.owner.name}
                          size="small"
                        />
                        <span className="text-sm text-gray-600">
                          by {capsule.owner.name}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {publicPagination.page < publicPagination.pages && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  loading={loadingMore}
                >
                  Load More Capsules
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;

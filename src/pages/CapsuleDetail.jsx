'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCapsuleById } from '../store/slices/capsuleSlice';
import { fetchMemories, clearMemories } from '../store/slices/memorySlice';
import CapsuleHeader from '../components/capsule/CapsuleHeader';
import MemoryFeed from '../components/memory/MemoryFeed';
import CreateMemoryModal from '../components/memory/CreateMemoryModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const CapsuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentCapsule,
    loading: capsuleLoading,
    error,
  } = useSelector((state) => state.capsules);
  const { memories, loading: memoriesLoading } = useSelector(
    (state) => state.memories
  );
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);

  const [showCreateMemory, setShowCreateMemory] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCapsuleById(id));
      dispatch(clearMemories());
      dispatch(fetchMemories({ capsuleId: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Join capsule room for real-time updates
    if (socket && id) {
      socket.emit('join_capsule', id);
      return () => {
        socket.emit('leave_capsule', id);
      };
    }
  }, [socket, id]);

  if (capsuleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Capsule Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCapsule) {
    return null;
  }

  const canContribute =
    currentCapsule.contributors?.some((c) => c.user._id === user._id) ||
    currentCapsule.owner._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <CapsuleHeader
        capsule={currentCapsule}
        onCreateMemory={() => setShowCreateMemory(true)}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemoryFeed
          memories={memories}
          loading={memoriesLoading}
          capsuleId={id}
        />
      </div>

      {canContribute && (
        <CreateMemoryModal
          isOpen={showCreateMemory}
          onClose={() => setShowCreateMemory(false)}
          capsuleId={id}
        />
      )}
    </div>
  );
};

export default CapsuleDetail;

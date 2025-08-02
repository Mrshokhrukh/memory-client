import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MemoryItem from '../memory/MemoryItem';
import authSlice from '../../store/slices/authSlice';
import capsuleSlice from '../../store/slices/capsuleSlice';

const mockStore = configureStore({
  reducer: {
    auth: authSlice,
    capsules: capsuleSlice,
  },
  preloadedState: {
    auth: {
      user: {
        _id: 'user1',
        name: 'Test User',
        avatarUrl: '',
      },
    },
    capsules: {
      currentCapsule: {
        _id: 'capsule1',
        owner: { _id: 'user1' },
        contributors: [],
      },
    },
  },
});

const mockMemory = {
  _id: 'memory1',
  type: 'text',
  title: 'Test Memory',
  text: 'This is a test memory',
  author: {
    _id: 'user1',
    name: 'Test User',
    avatarUrl: '',
  },
  reactions: [],
  comments: [],
  createdAt: new Date().toISOString(),
  isPinned: false,
};

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('MemoryItem Component', () => {
  it('renders memory content', () => {
    renderWithProviders(<MemoryItem memory={mockMemory} />);

    expect(screen.getByText('Test Memory')).toBeInTheDocument();
    expect(screen.getByText('This is a test memory')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows pinned indicator when memory is pinned', () => {
    const pinnedMemory = { ...mockMemory, isPinned: true };
    renderWithProviders(<MemoryItem memory={pinnedMemory} />);

    expect(screen.getByRole('button', { name: /pin/i })).toBeInTheDocument();
  });

  it('displays reaction counts', () => {
    const memoryWithReactions = {
      ...mockMemory,
      reactions: [
        { user: { _id: 'user1' }, emoji: '❤️' },
        { user: { _id: 'user2' }, emoji: '❤️' },
      ],
    };

    renderWithProviders(<MemoryItem memory={memoryWithReactions} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

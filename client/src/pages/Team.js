import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  Mail,
  Calendar,
  Briefcase,
  MoreVertical,
  UserPlus,
  Shield,
  User,
  Crown,
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

const Team = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState({ isOpen: false, userId: null });

  useEffect(() => {
    fetchProjects();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTeamMembers();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.projects || []);
      if (response.projects?.length > 0 && !selectedProject) {
        setSelectedProject(response.projects[0]._id);
      }
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error('Projects error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await projectService.getProject(selectedProject);
      setTeamMembers(response.project?.members || []);
    } catch (error) {
      toast.error('Failed to fetch team members');
      console.error('Team members error:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'member' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member' },
        { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'admin' },
        { _id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'member' },
      ];
      setAllUsers(mockUsers);
    } catch (error) {
      console.error('Users fetch error:', error);
    }
  };

  const handleAddMember = async (userId, role = 'member') => {
    try {
      await projectService.addMember(selectedProject, { email: allUsers.find(u => u._id === userId)?.email, role });
      toast.success('Team member added successfully');
      setShowAddMemberModal(false);
      fetchTeamMembers();
    } catch (error) {
      toast.error('Failed to add team member');
      console.error('Add member error:', error);
    }
  };

  const handleRemoveMember = async (userId) => {
    setRemoveConfirm({ isOpen: true, userId });
  };

  const confirmRemoveMember = async () => {
    try {
      await projectService.removeMember(selectedProject, removeConfirm.userId);
      toast.success('Team member removed successfully');
      fetchTeamMembers();
      setRemoveConfirm({ isOpen: false, userId: null });
    } catch (error) {
      toast.error('Failed to remove team member');
      console.error('Remove member error:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-warning';
      default:
        return 'badge-gray';
    }
  };

  const currentProject = projects.find(p => p._id === selectedProject);
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">Manage team members and project collaborations</p>
        </div>
        <button
          onClick={() => setShowAddMemberModal(true)}
          disabled={!selectedProject}
          className="btn-primary flex items-center disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </button>
      </div>

      {/* Project Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="input"
            >
              <option value="">Choose a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentProject && (
        <>
          {/* Project Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{currentProject.name}</h2>
                <p className="text-gray-600">{currentProject.description || 'No description'}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{teamMembers.length}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            </div>
            {teamMembers.length === 0 ? (
              <div className="card-body text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No team members yet</p>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="btn-primary"
                >
                  Add First Member
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <div key={member.user._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                          <span className="text-primary-600 font-medium text-lg">
                            {member.user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{member.user.name}</h4>
                            <span className={`badge ${getRoleColor(member.role)} ml-2`}>
                              {getRoleIcon(member.role)}
                              <span className="ml-1">{member.role}</span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{member.user.email}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {currentProject.owner?._id === user?.id && member.user._id !== user?.id && (
                          <button
                            onClick={() => handleRemoveMember(member.user._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!selectedProject && (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Project</h3>
          <p className="text-gray-600">Choose a project to view and manage its team members</p>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <AddMemberModal
          users={filteredUsers}
          onClose={() => setShowAddMemberModal(false)}
          onAdd={handleAddMember}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {/* Remove Member Confirmation Dialog */}
      <ConfirmDialog
        isOpen={removeConfirm.isOpen}
        onClose={() => setRemoveConfirm({ isOpen: false, userId: null })}
        onConfirm={confirmRemoveMember}
        title="Remove Team Member"
        message="Are you sure you want to remove this team member? They will lose access to this project."
        confirmText="Remove Member"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

// Add Member Modal Component
const AddMemberModal = ({ users, onClose, onAdd, searchTerm, setSearchTerm }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');

  const handleAdd = () => {
    if (selectedUser) {
      onAdd(selectedUser, selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Add Team Member</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select User
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {users.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No users found
                  </div>
                ) : (
                  users.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="user"
                        value={user._id}
                        checked={selectedUser === user._id}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selectedUser}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;

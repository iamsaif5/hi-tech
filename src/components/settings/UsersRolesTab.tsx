
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, UserX, Mail, Phone, Lock } from 'lucide-react';

const UsersRolesTab = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@hitec.co.za',
      phone: '+27 82 123 4567',
      role: 'Admin',
      factory: 'Cape Town Factory',
      status: 'Active',
      permissions: ['dashboard', 'orders', 'production', 'inventory', 'staff', 'finance', 'reports', 'settings']
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@hitec.co.za',
      phone: '+27 83 234 5678',
      role: 'Supervisor',
      factory: 'Cape Town Factory',
      status: 'Active',
      permissions: ['dashboard', 'orders', 'production', 'inventory', 'staff', 'reports']
    },
    {
      id: 3,
      name: 'Lisa Taylor',
      email: 'lisa.taylor@hitec.co.za',
      phone: '+27 84 345 6789',
      role: 'Operator',
      factory: 'Johannesburg Facility',
      status: 'Active',
      permissions: ['dashboard', 'production', 'staff']
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@hitec.co.za',
      phone: '+27 85 456 7890',
      role: 'Viewer',
      factory: 'Durban Warehouse',
      status: 'Inactive',
      permissions: ['dashboard']
    }
  ]);

  const [userTypes, setUserTypes] = useState([
    { id: 1, name: 'Owner', description: 'Full system access with admin privileges', permissions: ['dashboard', 'orders', 'production', 'inventory', 'staff', 'finance', 'reports', 'settings', 'user_management'] },
    { id: 2, name: 'Admin', description: 'Administrative access to most features', permissions: ['dashboard', 'orders', 'production', 'inventory', 'staff', 'finance', 'reports', 'settings'] },
    { id: 3, name: 'Supervisor', description: 'Management access to operations', permissions: ['dashboard', 'orders', 'production', 'inventory', 'staff', 'reports'] },
    { id: 4, name: 'Operator', description: 'Basic operational access', permissions: ['dashboard', 'production', 'staff'] },
    { id: 5, name: 'Viewer', description: 'Read-only access to dashboard', permissions: ['dashboard'] }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Viewer',
    factory: 'Cape Town Factory',
    permissions: ['dashboard']
  });

  const [editUser, setEditUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAddUserType, setShowAddUserType] = useState(false);
  const [newUserType, setNewUserType] = useState({ name: '', description: '', permissions: [] });

  const availablePermissions = [
    { id: 'dashboard', name: 'Dashboard', description: 'View main dashboard' },
    { id: 'orders', name: 'Orders', description: 'Manage customer orders' },
    { id: 'production', name: 'Production', description: 'Access production data' },
    { id: 'inventory', name: 'Inventory', description: 'Manage inventory' },
    { id: 'staff', name: 'Staff', description: 'Staff management' },
    { id: 'finance', name: 'Finance', description: 'Financial data and reports' },
    { id: 'reports', name: 'Reports', description: 'Generate and view reports' },
    { id: 'settings', name: 'Settings', description: 'System configuration' },
    { id: 'user_management', name: 'User Management', description: 'Manage system users' }
  ];

  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-xs font-medium">Active</span></div>
      : <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div><span className="text-xs font-medium">Inactive</span></div>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      Owner: 'bg-red-500',
      Admin: 'bg-blue-500',
      Supervisor: 'bg-purple-500',
      Operator: 'bg-orange-500',
      Viewer: 'bg-gray-500'
    };
    return <Badge className={`${colors[role as keyof typeof colors]} text-white hover:${colors[role as keyof typeof colors]}`}>{role}</Badge>;
  };

  const handlePermissionChange = (permissionId: string, checked: boolean, isUserType = false) => {
    if (isUserType) {
      setNewUserType(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, permissionId]
          : prev.permissions.filter(p => p !== permissionId)
      }));
    } else if (editUser) {
      setEditUser(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, permissionId]
          : prev.permissions.filter(p => p !== permissionId)
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, permissionId]
          : prev.permissions.filter(p => p !== permissionId)
      }));
    }
  };

  const handleSelectAllPermissions = (checked: boolean, isUserType = false) => {
    if (isUserType) {
      setNewUserType(prev => ({
        ...prev,
        permissions: checked ? availablePermissions.map(p => p.id) : []
      }));
    } else if (editUser) {
      setEditUser(prev => ({
        ...prev,
        permissions: checked ? availablePermissions.map(p => p.id) : []
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        permissions: checked ? availablePermissions.map(p => p.id) : []
      }));
    }
  };

  const handleAddUser = () => {
    const user = {
      id: Date.now(),
      ...newUser,
      status: 'Active'
    };
    setUsers([...users, user]);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', phone: '', role: 'Viewer', factory: 'Cape Town Factory', permissions: ['dashboard'] });
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user });
    setShowEditUser(true);
  };

  const handleUpdateUser = () => {
    setUsers(users.map(u => u.id === editUser.id ? editUser : u));
    setShowEditUser(false);
    setEditUser(null);
  };

  const handleResetPassword = (userId) => {
    console.log('Reset password for user:', userId);
    // Implementation for password reset
  };

  const handleAddUserType = () => {
    const userType = {
      id: Date.now(),
      ...newUserType
    };
    setUserTypes([...userTypes, userType]);
    setShowAddUserType(false);
    setNewUserType({ name: '', description: '', permissions: [] });
  };

  const handleRoleChange = (role: string, isEdit = false) => {
    const selectedUserType = userTypes.find(ut => ut.name === role);
    if (selectedUserType) {
      if (isEdit) {
        setEditUser(prev => ({
          ...prev,
          role,
          permissions: [...selectedUserType.permissions]
        }));
      } else {
        setNewUser(prev => ({
          ...prev,
          role,
          permissions: [...selectedUserType.permissions]
        }));
      }
    }
  };

  const PermissionsMatrix = ({ permissions, onPermissionChange, onSelectAll, isUserType = false }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={permissions.length === availablePermissions.length}
          onCheckedChange={(checked) => onSelectAll(checked, isUserType)}
        />
        <Label htmlFor="select-all" className="font-medium">Select all permissions</Label>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {availablePermissions.map((permission) => (
          <div key={permission.id} className="flex items-start space-x-2">
            <Checkbox
              id={permission.id}
              checked={permissions.includes(permission.id)}
              onCheckedChange={(checked) => onPermissionChange(permission.id, checked, isUserType)}
            />
            <div>
              <Label htmlFor={permission.id} className="font-medium">{permission.name}</Label>
              <p className="text-xs text-muted-foreground">{permission.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex gap-6">
      {/* Main Content - 80% */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">System Users</h3>
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email Address</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userPhone">Phone Number</Label>
                    <Input
                      id="userPhone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">User Role</Label>
                    <select
                      id="userRole"
                      value={newUser.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="mt-1 w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      {userTypes.map(userType => (
                        <option key={userType.name} value={userType.name}>{userType.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="userFactory">Factory Location</Label>
                    <select
                      id="userFactory"
                      value={newUser.factory}
                      onChange={(e) => setNewUser({...newUser, factory: e.target.value})}
                      className="mt-1 w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="Cape Town Factory">Cape Town Factory</option>
                      <option value="Johannesburg Facility">Johannesburg Facility</option>
                      <option value="Durban Warehouse">Durban Warehouse</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">Permissions</Label>
                  <div className="mt-2">
                    <PermissionsMatrix
                      permissions={newUser.permissions}
                      onPermissionChange={handlePermissionChange}
                      onSelectAll={handleSelectAllPermissions}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Factory Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.factory}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleResetPassword(user.id)}>
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {editUser && (
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editUserName">Full Name</Label>
                    <Input
                      id="editUserName"
                      value={editUser.name}
                      onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editUserEmail">Email Address</Label>
                    <Input
                      id="editUserEmail"
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editUserPhone">Phone Number</Label>
                    <Input
                      id="editUserPhone"
                      value={editUser.phone}
                      onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editUserRole">User Role</Label>
                    <select
                      id="editUserRole"
                      value={editUser.role}
                      onChange={(e) => handleRoleChange(e.target.value, true)}
                      className="mt-1 w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      {userTypes.map(userType => (
                        <option key={userType.name} value={userType.name}>{userType.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="editUserFactory">Factory Location</Label>
                    <select
                      id="editUserFactory"
                      value={editUser.factory}
                      onChange={(e) => setEditUser({...editUser, factory: e.target.value})}
                      className="mt-1 w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="Cape Town Factory">Cape Town Factory</option>
                      <option value="Johannesburg Facility">Johannesburg Facility</option>
                      <option value="Durban Warehouse">Durban Warehouse</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(editUser.id)}>
                      <Lock className="h-4 w-4 mr-2" />
                      Reset Password
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">Permissions</Label>
                  <div className="mt-2">
                    <PermissionsMatrix
                      permissions={editUser.permissions}
                      onPermissionChange={handlePermissionChange}
                      onSelectAll={handleSelectAllPermissions}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditUser(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sidebar - 20% */}
      <div className="w-80 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">User Types</h3>
          <Dialog open={showAddUserType} onOpenChange={setShowAddUserType}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="userTypeName">Role Name</Label>
                  <Input
                    id="userTypeName"
                    value={newUserType.name}
                    onChange={(e) => setNewUserType({...newUserType, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="userTypeDescription">Description</Label>
                  <Input
                    id="userTypeDescription"
                    value={newUserType.description}
                    onChange={(e) => setNewUserType({...newUserType, description: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium">Permissions</Label>
                  <div className="mt-2">
                    <PermissionsMatrix
                      permissions={newUserType.permissions}
                      onPermissionChange={handlePermissionChange}
                      onSelectAll={handleSelectAllPermissions}
                      isUserType={true}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddUserType(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUserType}>
                  Add Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            {userTypes.map((userType) => (
              <div key={userType.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{userType.name}</h4>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{userType.description}</p>
                <div className="text-xs">
                  <span className="font-medium">Permissions: </span>
                  <span>{userType.permissions.length} modules</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersRolesTab;

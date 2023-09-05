import { User, Workspace } from '../../models';
import { lock } from '../../utils/locker';
import logger from '../../utils/logger';
import { toSlug } from '../../utils/common';

export const getWorkspace = ({ identifier }) => {
  identifier = toSlug(identifier);
  return Workspace.findOne({ identifier });
};

export const create = async (
  { name, email, password, scope = 'USER', workspace },
  isAdmin = false
) => {
  workspace.identifier = toSlug(workspace.identifier);

  let isDuplicateWorkspace = await getWorkspace({
    identifier: workspace.identifier,
  });

  logger.debug('isDuplicateWorkspace?', isDuplicateWorkspace);

  if (isDuplicateWorkspace) {
    throw {
      status: 409,
      message: `Workspace with identifier "${workspace.identifier}" already exists`,
    };
  }

  workspace = await Workspace.create(workspace);

  const args = {
    name,
    email,
    password,
    scope,
    workspace: workspace._id,
  };

  const count = await User.countDocuments();

  if (count === 0) {
    args.scope = 'ADMIN';
  } else if (!isAdmin) {
    args.scope = 'USER';
  }

  return User.create(args);
};

export const signin = async ({ email, password, workspace }) => {
  workspace = await getWorkspace({ identifier: workspace });

  if (!workspace) {
    throw {
      status: 401,
      message: 'Workspace not found',
    };
  }

  const args = {
    email,
    password,
    workspace: workspace._id,
  };

  const user = await User.findOne(args).populate('workspace');

  if (!user) {
    throw { status: 401, message: 'Invalid email or password' };
  }
  return lock(user.toJSON());
};

export const checkWorkspaceAvailability = async ({ identifier }) => {
  const workspace = await getWorkspace({
    identifier,
  });
  console.log('workspace', workspace, identifier);
  return !workspace ? true : false;
};

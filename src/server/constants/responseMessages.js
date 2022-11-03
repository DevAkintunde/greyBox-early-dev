const general = (resource, action) => `${resource} ${action} successfully.`;

export const created = (resource) => general(resource, 'created');
export const updated = (resource) => general(resource, 'updated');
export const deleted = (resource) => general(resource, 'deleted');
export const verified = (resource) => general(resource, 'verified');

export const exists = (resource) => `${resource} already exists.`;
export const notFound = (resource) => `${resource} not found.`;
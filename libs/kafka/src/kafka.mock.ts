export const KafkaMock = {
  connect: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn().mockImplementation((topic, message) => ({ topic, message })),
  send: jest.fn().mockImplementation((topic, message) => Promise.resolve({ topic, message })),
};

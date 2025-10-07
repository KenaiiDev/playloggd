type UUID = string;

export interface BaseEntity {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
}

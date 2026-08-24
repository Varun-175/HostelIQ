import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  action: string;
  actorId?: mongoose.Types.ObjectId;
  actorRole?: string;
  previousState?: any;
  newState?: any;
  metadata?: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema(
  {
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional, maybe SYSTEM
    actorRole: { type: String },
    previousState: { type: Schema.Types.Mixed },
    newState: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  }
);

// Indexes
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ actorId: 1 });
AuditLogSchema.index({ timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

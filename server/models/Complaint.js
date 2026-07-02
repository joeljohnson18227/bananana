import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    attachments: {
      type: [
        {
          name: { type: String, trim: true, default: '' },
          type: { type: String, trim: true, default: '' },
          size: { type: Number, default: 0 },
          dataUrl: { type: String, default: '' },
          kind: { type: String, enum: ['image', 'video'], default: 'image' },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'open', 'in_progress', 'resolved', 'rejected'],
      default: 'pending',
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      lowercase: true,
      trim: true,
    },
    assignedTo: {
      type: String,
      trim: true,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    viewedByAdminAt: {
      type: Date,
      default: null,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createdDate', updatedAt: false },
    minimize: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const populatedCreatedBy = ret.createdBy && typeof ret.createdBy === 'object' ? ret.createdBy : null;
        const populatedStudent = ret.student && typeof ret.student === 'object' ? ret.student : null;
        const createdById =
          populatedCreatedBy?._id?.toString?.() ??
          populatedStudent?._id?.toString?.() ??
          ret.createdBy?.toString?.() ??
          ret.student?.toString?.();
        const creatorName = populatedCreatedBy?.name ?? populatedStudent?.name;

        ret.id = ret._id.toString();
        ret.createdBy = createdById;
        ret.student = createdById;
        ret.studentId = createdById;
        ret.studentName = creatorName;
        ret.createdByName = creatorName;
        ret.createdByEmail = populatedCreatedBy?.email ?? populatedStudent?.email;
        ret.submittedAt = ret.createdDate;
        ret.attachments = Array.isArray(ret.attachments) ? ret.attachments : [];
        ret.viewedByAdminAt = ret.viewedByAdminAt ?? null;
        ret.viewedByAdmin = Boolean(ret.viewedByAdminAt);
        if (ret.status === 'open') {
          ret.status = 'pending';
        }
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

complaintSchema.pre('save', function syncLegacyFields() {
  if (this.createdBy && !this.student) {
    this.student = this.createdBy;
  }

  if (!this.createdBy && this.student) {
    this.createdBy = this.student;
  }

  if (this.status === 'open') {
    this.status = 'pending';
  }
});

complaintSchema.index({ createdDate: -1 });
complaintSchema.index({ status: 1, createdBy: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;

var MeshHierarchyLabeler = require('part-annotator/MeshHierarchyLabeler');
var Segments = require('geo/Segments');

/**
 * {@link MeshHierarchyLabeler} with custom segmentation
 * @constructor
 * @extends MeshHierarchyLabeler
 */
function SegmentHierarchyLabeler(params) {
  MeshHierarchyLabeler.call(this, params);
  this.onSegmentsLoaded = params.onSegmentsLoaded;
  this.segmentType = params.segmentType || 'surfaces';
  console.log('Segment type is ' + this.segmentType);
  this.segments = new Segments({
    skipSegmentedObject3D: true,
    skipUnlabeledSegment: true
  },  this.segmentType);
}

SegmentHierarchyLabeler.prototype = Object.create(MeshHierarchyLabeler.prototype);
SegmentHierarchyLabeler.prototype.constructor = SegmentHierarchyLabeler;

SegmentHierarchyLabeler.prototype.setTarget = function(modelInstance) {
  MeshHierarchyLabeler.prototype.setTarget.call(this, modelInstance);
  this.segments.init(modelInstance);
  this.segments.loadSegments(function (err, res) {
    if (this.segments.segmentedObject3DHierarchical) {
      this.meshHierarchy.setSegmented(this.segments.segmentedObject3DHierarchical);
      this.maxHierarchyLevel = this.meshHierarchy.maxHierarchyLevel;
      if (this.showNodeCallback) {
        this.showNodeCallback(this.meshHierarchy.partsNode);
      }
    }

    if (!err && this.onSegmentsLoaded) {
      this.onSegmentsLoaded(this.segments);
    }
  }.bind(this));
};

module.exports = SegmentHierarchyLabeler;


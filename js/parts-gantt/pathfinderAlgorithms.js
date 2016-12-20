/**
* (c) 2016 Highsoft AS
* Author: Øystein Moseng
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var min = Math.min,
	max = Math.max,
	abs = Math.abs,
	pick = H.pick;

/**
 * Get index of last obstacle before xMin. Employs a type of binary search, and
 * thus requires that obstacles are sorted by xMin value.
 *
 * @param {Array} obstacles Array of obstacles to search in.
 * @param {Number} xMin The xMin threshold.
 * @param {Number} startIx Starting index to search from. Must be within array
 *  range.
 *
 * @return {Number} result The index of the last obstacle element before xMin.
 */
function findLastObstacleBefore(obstacles, xMin, startIx) {
	var left = startIx || 0, // left limit
		right = obstacles.length - 1, // right limit
		min = xMin - 0.0000001, // Make sure we include all obstacles at xMin
		cursor,
		cmp;
	while (left <= right) {
		cursor = (right + left) >> 1;
		cmp = min - obstacles[cursor].xMin;
		if (cmp > 0) {
			left = cursor + 1;
		} else if (cmp < 0) {
			right = cursor - 1;
		} else {
			return cursor;
		}
	}
	return left > 0 ? left - 1 : 0;
}

/**
 * Test if a point lays within an obstacle. 
 *
 * @param {Object} obstacle Obstacle to test.
 * @param {Object} point Point with x/y props.
 * @param {Object} options Obstacle options, including margin.
 *
 * @return {Boolean} result Whether point is within the obstacle or not.
 */
function pointWithinObstacle(obstacle, point, options) {
	var margin = options.margin || 0;
	return (
		point.x <= obstacle.xMax - margin &&
		point.x >= obstacle.xMin + margin &&
		point.y <= obstacle.yMax - margin &&
		point.y >= obstacle.yMin + margin
	);
}

/**
 * Find the index of an obstacle that wraps around a point. 
 * Returns -1 if not found.
 *
 * @param {Array} obstacles Obstacles to test.
 * @param {Object} point Point with x/y props.
 * @param {Object} options Obstacle options, including margin.
 *
 * @return {Number} result Ix of the obstacle in the array, or -1 if not found.
 */
function findObstacleFromPoint(obstacles, point, options) {
	for (var i = findLastObstacleBefore(obstacles, point.x); 
			i < obstacles.length && obstacles[i].xMin <= point.x; ++i) {
		if (pointWithinObstacle(obstacles[i], point, options)) {
			return i;
		}
	}
	return -1;
}

/**
 * Get SVG path array from array of line segments.
 *
 * @param {Array} segments The segments to build the path from.
 *
 * @return {Array} result SVG path array as accepted by the SVG Renderer.
 */
function pathFromSegments(segments) {
	var path = [];
	if (segments.length) {
		path.push('M', segments[0].start.x, segments[0].start.y);
		for (var i = 0; i < segments.length; ++i) {
			path.push('L', segments[i].end.x, segments[i].end.y);
		}
	}
	return path;
}



// Define the available pathfinding algorithms.
// Algorithms take up to 3 arguments: starting point, ending point, and an 
// options object.
var algorithms = {

	/**
	 * Get an SVG path from a starting coordinate to an ending coordinate.
	 * Draws a straight line.		 
	 *
	 * @param {Object} start Starting coordinate, object with x/y props.
	 * @param {Object} end Ending coordinate, object with x/y props.
	 *
	 * @return {Object} result An object with the SVG path in Array form as
	 * 	accepted by the SVG renderer, as well as an array of new obstacles 
	 *  making up this path.
	 */
	straight: function (start, end) {
		return {
			path: ['M', start.x, start.y, 'L', end.x, end.y],
			obstacles: [{ start, end }]
		};
	},

	/**
	 * Find a path from a starting coordinate to an ending coordinate, taking 
	 * obstacles into consideration. Might not always find the optimal path, 
	 * but is fast, and usually good enough.
	 *
	 *  Options
	 *      - chartObstacles:   Array of chart obstacles to avoid
	 *      - lineObstacles:    Array of line obstacles to jump over
	 *		- obstacleMetrics:  Object with metrics of chartObstacles cached
	 *		- hardBounds:		Hard boundaries to not cross
	 *		- obstacleOptions:	Options for the obstacles, including margin
	 *
	 * @param {Object} start Starting coordinate, object with x/y props.
	 * @param {Object} end Ending coordinate, object with x/y props.
	 * @param {Object} options Options for the algorithm.
	 *
	 * @return {Object} result An object with the SVG path in Array form as
	 * 	accepted by the SVG renderer, as well as an array of new obstacles 
	 *  making up this path.
	 */
	fastAvoid: H.extend(function (start, end, options) {
		/*
			Algorithm rules/description
			- Find initial direction
			- Determine soft/hard max for each direction.
			- Move along initial direction until obstacle.
			- Change direction.
			- If hitting obstacle, first try to change length of previous line
			  before changing direction again.
			- When changing directions, change them in the middle of the line.

			Soft min/max x = start/destination x +/- widest obstacle + margin
			Soft min/max y = start/destination y +/- tallest obstacle + margin

			TODO:
				- Make avoid the start/end obstacles in an intelligent way
				- Make retrospective, try changing prev segment to reduce 
				  corners
				- Find more aestetic pivot point by pivoting in the middle of 
				  two obstacles
		*/
		var segments,

			// Boundaries to stay within. If beyond soft boundary, prefer to
			// change direction ASAP. If at hard max, always change immediately.
			metrics = options.obstacleMetrics,
			softMinX = min(start.x, end.x) - metrics.maxWidth - 30,
			softMaxX = max(start.x, end.x) + metrics.maxWidth + 30,
			softMinY = min(start.y, end.y) - metrics.maxHeight - 30,
			softMaxY = max(start.y, end.y) + metrics.maxHeight + 30,

			// Obstacles
			chartObstacles = options.chartObstacles,
			startObstacleIx = findLastObstacleBefore(chartObstacles, softMinX),
			endObstacleIx = findLastObstacleBefore(chartObstacles, softMaxX);

		// TODO
		function pivotPoint(fromPoint, toPoint) {
			return toPoint;
		}

		function clearPathTo(fromPoint, toPoint, directionIsX) {
			// Don't waste time if we've hit goal
			if (fromPoint.x === toPoint.x && fromPoint.y === toPoint.y) {
				return [];
			}

			var dirIsX = pick(directionIsX, Math.abs(toPoint.x - fromPoint.x) >
							Math.abs(toPoint.y - fromPoint.y)),
				pivot = pivotPoint(fromPoint, {
					x: dirIsX ? toPoint.x : fromPoint.x,
					y: dirIsX ? fromPoint.y : toPoint.y
				}),
				segments = [{
					start: fromPoint,
					end: {
						x: pivot.x,
						y: pivot.y
					}
				}],
				waypoint,
				waypointUseMax,
				maxOutOfSoftBounds,
				minOutOfSoftBounds,
				maxOutOfHardBounds,
				minOutOfHardBounds;

			// Pivot before goal, use a waypoint to dodge obstacle
			if (pivot[dirIsX ? 'x' : 'y'] !== toPoint[dirIsX ? 'x' : 'y']) {
				// Find direction of waypoint
				maxOutOfSoftBounds = pivot.obstacle[dirIsX ? 'yMax' : 'xMax'] >
											(dirIsX ? softMaxY : softMaxX);
				minOutOfSoftBounds = pivot.obstacle[dirIsX ? 'yMin' : 'xMin'] <
											(dirIsX ? softMinY : softMinX);
				maxOutOfHardBounds = pivot.obstacle[dirIsX ? 'yMax' : 'xMax'] >
								options.hardBounds[dirIsX ? 'yMax' : 'xMax'];
				minOutOfHardBounds = pivot.obstacle[dirIsX ? 'yMin' : 'xMin'] <
								options.hardBounds[dirIsX ? 'yMin' : 'xMin'];
				waypointUseMax = abs(
						pivot.obstacle[dirIsX ? 'yMin' : 'xMin'] -
						pivot[dirIsX ? 'y' : 'x']
					) >
					abs(
						pivot.obstacle[dirIsX ? 'yMax' : 'xMax'] -
						pivot[dirIsX ? 'y' : 'x']
					);
				waypointUseMax = (!maxOutOfSoftBounds ||
								minOutOfSoftBounds && waypointUseMax) &&
								(!maxOutOfHardBounds ||
								minOutOfHardBounds && waypointUseMax);

				// Cut waypoint to hard bounds
				if (dirIsX) {
					pivot.obstacle.yMin = max(
						pivot.obstacle.yMin, options.hardBounds.yMin);
					pivot.obstacle.yMax = min(
							pivot.obstacle.yMax, options.hardBounds.yMax);
				} else {
					pivot.obstacle.xMin = max(
						pivot.obstacle.xMin, options.hardBounds.xMin);
					pivot.obstacle.xMax = min(
							pivot.obstacle.xMax, options.hardBounds.xMax);					
				}

				waypoint = {
					x: dirIsX ?
						pivot.x :
						pivot.obstacle[waypointUseMax ? 'xMax' : 'xMin'],
					y: dirIsX ?
						pivot.obstacle[waypointUseMax ? 'yMax' : 'yMin'] :
						pivot.y
				};

				// We're changing direction here, store that to make sure we
				// also change direction when adding the last segment array
				// after handling waypoint.
				dirIsX = !dirIsX;

				segments = segments.concat(clearPathTo({
					x: pivot.x,
					y: pivot.y
				}, waypoint, dirIsX));
			}

			// Get segments for the other direction too
			// Recursion is our friend
			segments = segments.concat(clearPathTo(
				segments[segments.length - 1].end, toPoint, !dirIsX
			));

			return segments;
		}

		// Cut the obstacle array for optimization in large datasets
		chartObstacles = chartObstacles.slice(startObstacleIx, endObstacleIx + 1);

		// Remove obstacles that envelop the start/end points
		while ((startObstacleIx = findObstacleFromPoint(chartObstacles, start,
			options.obstacleOptions)) > -1) {
			chartObstacles.splice(startObstacleIx, 1);
		}
		while ((endObstacleIx = findObstacleFromPoint(chartObstacles, end, 
			options, options.obstacleOptions)) > -1) {
			chartObstacles.splice(endObstacleIx, 1);
		}

		// Find the path
		segments = clearPathTo(start, end);

		return {
			path: pathFromSegments(segments),
			obstacles: segments
		};
	}, {
		requiresObstacles: true
	})
};

export default algorithms;

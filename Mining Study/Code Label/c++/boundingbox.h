#ifndef BOUNDINGBOX_H
#define BOUNDINGBOX_H

#include "vec3.h"
#include "ray.h"

class BoundingBox {
    // generated line-by-line by copilot
    public:
        Point3 leftBottomBack;
        Point3 rightTopFront;

        BoundingBox() {}
        BoundingBox(Point3 leftBottomBack, Point3 rightTopFront) : leftBottomBack(leftBottomBack), rightTopFront(rightTopFront) {}
        BoundingBox(const BoundingBox& b1, const BoundingBox& b2) { // function signature is prompt, but implementation is by copilot
            leftBottomBack = Point3(std::min(b1.leftBottomBack.x(), b2.leftBottomBack.x()), 
                                    std::min(b1.leftBottomBack.y(), b2.leftBottomBack.y()), 
                                    std::min(b1.leftBottomBack.z(), b2.leftBottomBack.z()));

            rightTopFront = Point3(std::max(b1.rightTopFront.x(), b2.rightTopFront.x()), 
                                    std::max(b1.rightTopFront.y(), b2.rightTopFront.y()), 
                                    std::max(b1.rightTopFront.z(), b2.rightTopFront.z()));
        }

        bool hit(const Ray& r) const {
            // uses answer by zachamars on https://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms
            Vec3 dirfrac = Vec3(1.0f / r.direction().x(), 1.0f / r.direction().y(), 1.0f / r.direction().z());

            double t1 = (leftBottomBack.x() - r.origin().x())*dirfrac.x();
            double t2 = (rightTopFront.x() - r.origin().x())*dirfrac.x();
            double t3 = (leftBottomBack.y() - r.origin().y())*dirfrac.y();
            double t4 = (rightTopFront.y() - r.origin().y())*dirfrac.y();
            double t5 = (leftBottomBack.z() - r.origin().z())*dirfrac.z();
            double t6 = (rightTopFront.z() - r.origin().z())*dirfrac.z();

            double tmin = std::max(std::max(std::min(t1, t2), std::min(t3, t4)), std::min(t5, t6));
            double tmax = std::min(std::min(std::max(t1, t2), std::max(t3, t4)), std::max(t5, t6));

            // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behind us
            if (tmax < 0) {
                return false;
            }

            // if tmin > tmax, ray doesn't intersect AABB
            if (tmin > tmax) {
                return false;
            }

            return true;
        }
};

#endif
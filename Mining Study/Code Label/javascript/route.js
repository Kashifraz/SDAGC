// Some code from Copilot
import connectDB from "@/lib/connectDB";
import Item from "@/model/Item";
import ItemView from "@/model/ItemWithMP";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
// import connectDB from "src/lib/connectDB.js";

export const GET = withApiAuthRequired(async function fetchItems(req) {
  // TODO: Stack Filters and Sorts
  let items;
  const res = new NextResponse();
  await connectDB();
  const { searchParams } = new URL(req.url);

  const filterOutSelf = searchParams.get("filterOutSelf");
  const filterByBrand = searchParams.get("filterByBrand");
  const filterByOwner = searchParams.get("filterByOwner");
  const filterByGoodPrice = searchParams.get("filterByGoodPrice");
  const filterByPrice = parseInt(searchParams.get("filterByPrice"));
  const showOnlySellingStatus = parseInt(
    searchParams.get("showOnlySellingStatus")
  ); // Remove For Sale Items (Only Sold)
  const sortByNew = searchParams.get("sortBy");

  let query = {};
  if (filterOutSelf) {
    query = { _id: { $ne: filterOutSelf } };
  }

  if (filterByBrand) {
    query = { ...query, brand: filterByBrand };
  }

  // Show everthing if owner, show only unsold if not
  if (filterByOwner) {
    query = { ...query, owner: filterByOwner };
    if (showOnlySellingStatus === null); // default no filter if owner
    // Explicit IFS
    if (showOnlySellingStatus == 1) {
      // remove
      query = { ...query, itemSellingStatus: { $ne: 0 } };
    } else if (showOnlySellingStatus == 0) {
      query = { ...query, itemSellingStatus: { $ne: 1 } };
    }
  } else {
    query = { ...query, itemSellingStatus: { $ne: 0 } }; // BY DEFAULT include only selling items
  }

  const range = filterByPrice * 0.25; // get 10 percent
  const upperLimit = filterByPrice + range;
  const lowerLimit = filterByPrice - range;
  console.log(filterByPrice, upperLimit, lowerLimit);
  if (filterByPrice) {
    query = { ...query, price: { $lte: upperLimit, $gte: lowerLimit } };
  }
  if (filterByGoodPrice) {
    query = { ...query, priceStatus: "Market Price" };
  }

  if (sortByNew == "createdDesc") {
    items = await ItemView.find({ ...query })
      .sort({ createdAt: -1 })
      .exec();
  } else {
    items = await ItemView.find({
      ...query,
    }).exec();
  }

  return NextResponse.json({ protected: items }, res);
});

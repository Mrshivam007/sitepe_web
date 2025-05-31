import BannerPageOutlet from "@/pages/dashbord/banners/BannerPageOutlet";
import Banners from "@/pages/dashbord/banners/Banners";
import NewBanner from "@/pages/dashbord/banners/NewBanner";
import Categories from "@/pages/dashbord/categories/Categories";
import CategoryPageOutlet from "@/pages/dashbord/categories/CategoryPageOutlet";
import NewCategory from "@/pages/dashbord/categories/NewCategory";
import DashboardOverview from "@/pages/dashbord/DashboardOverview";
import FeedbackDetail from "@/pages/dashbord/feedbacks/FeedbackDetail";
import Feedbacks from "@/pages/dashbord/feedbacks/Feedbacks";
import NewFeedback from "@/pages/dashbord/feedbacks/NewFeedback";
import OrderDetail from "@/pages/dashbord/orders/OrderDetail";
import OrderPageOutlet from "@/pages/dashbord/orders/OrderPageOutlet";
import Orders from "@/pages/dashbord/orders/Orders";
import NewProduct from "@/pages/dashbord/products/NewProduct";
import ProductPageOutlet from "@/pages/dashbord/products/ProductPageOutlet";
import Products from "@/pages/dashbord/products/Products";
import NewScheme from "@/pages/dashbord/products/schemes/NewScheme";
import Schemes from "@/pages/dashbord/products/schemes/Schemes";
import NewSubCategory from "@/pages/dashbord/subcategories/NewSubCategory";
import SubCategories from "@/pages/dashbord/subcategories/SubCategories";
import SubCategoryPageOutlet from "@/pages/dashbord/subcategories/SubCategoryPageOutlet";
import Units from "@/pages/dashbord/units/Units";
import {
  Boxes,
  LayoutGrid,
  LayoutList,
  MonitorPlay,
  SquareStack,
  Combine,
  BookA,
  MessageCircle,
} from "lucide-react";

const menuItems = [
  // Dashboard
  {
    name: "Dashboard",
    href: "/dashboard",
    component: <DashboardOverview />,
    icon: LayoutGrid,
  },
  // Categories
  {
    name: "Categories",
    href: "/dashboard/categories",
    component: <CategoryPageOutlet />,
    icon: LayoutList,
    subMenuItems: [
      {
        name: "Categories",
        href: "/dashboard/categories",
        component: <Categories />,
      },
      {
        name: "New Category",
        href: "new",
        component: <NewCategory />,
      },
      {
        name: "New Bulk Categories",
        href: "newmany",
        component: <h1>new bulk categories</h1>,
      },
    ],
  },
  // Sub Categories
  {
    name: "Sub Categories",
    href: "/dashboard/subcategories",
    component: <SubCategoryPageOutlet />,
    icon: SquareStack,
    subMenuItems: [
      {
        name: "Sub Categories",
        href: "/dashboard/subcategories",
        component: <SubCategories />,
      },
      {
        name: "New Sub Category",
        href: "new",
        component: <NewSubCategory />,
      },
      {
        name: "New Bulk Categories",
        href: "newmany",
        component: <h1>new bulk subcategories</h1>,
      },
    ],
  },
  // Products
  {
    name: "Products",
    href: "/dashboard/products",
    component: <ProductPageOutlet />,
    icon: Boxes,
    subMenuItems: [
      {
        name: "Products",
        href: "/dashboard/products",
        component: <Products />,
      },
      {
        name: "New Product",
        href: "new",
        component: <NewProduct />,
      },
      {
        name: "New Bulk Product",
        href: "newmany",
        component: <h1>new bulk product</h1>,
      },
      {
        name: "Product Schemes",
        href: ":productSlug/schemes",
        component: <Schemes />,
      },
      {
        name: "Product new Scheme",
        href: ":productSlug/schemes/new",
        component: <NewScheme />,
      },
    ],
  },
  // Store Banners
  {
    name: "Store Banners",
    href: "/dashboard/banners",
    component: <BannerPageOutlet />,
    icon: MonitorPlay,
    subMenuItems: [
      {
        name: "Store Banners",
        href: "/dashboard/banners",
        component: <Banners />,
      },
      {
        name: "New Banner",
        href: "new",
        component: <NewBanner />,
      },
      {
        name: "New Bulk Banner",
        href: "newmany",
        component: <h1>new bulk banner</h1>,
      },
    ],
  },
  // Units
  {
    name: "Units",
    href: "/dashboard/units",
    component: <Units />,
    icon: Combine,
  },
  // Orders
  {
    name: "Orders",
    href: "/dashboard/orders",
    component: <OrderPageOutlet />,
    icon: BookA,
    subMenuItems: [
      {
        name: "Orders",
        href: "/dashboard/orders",
        component: <Orders />,
      },
      {
        name: "Order Detail",
        href: ":orderId",
        component: <OrderDetail />,
      },
    ],
  },
  // Feedback
  {
    name: "Feedbacks",
    href: "/dashboard/feedbacks",
    component: <OrderPageOutlet />,
    icon: MessageCircle,
    subMenuItems: [
      {
        name: "Feedbacks",
        href: "/dashboard/feedbacks",
        component: <Feedbacks />,
      },
      {
        name: "Feedback Detail",
        href: ":feedbackId",
        component: <FeedbackDetail />,
      },
      {
        name: "New Feedback",
        href: "new",
        component: <NewFeedback />,
      },
    ],
  },
];

export default menuItems;

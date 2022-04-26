class MasterProjection {


    StaticPage(local) {
      return {
        PageTitle: "$PageTitle_" + local,
        PageCode: 1,
        PageUrl: 1,
        Description:"$Description_" + local,
        MetaTitle:"$MetaTitle_" + local,
        MetaKey: 1,
        MetaDescription: "$MetaDescription_" + local,
        DataAdded: 1,
        LastModified: 1,
        LastModifiedBy: 1
      };
    }
    RestaurantNotification(local) {
      return {
        RestaurantId: 1,
        Title: "$Title_" + local,
        Body: "$Body_" + local,
        CreatedAt: 1,
      };
    }
    CustomerNotification(local) {
      return {
        CustomerId: 1,
        Title: "$Title_" + local,
        Body: "$Body_" + local,
        CreatedAt: 1,
      };
    }

    Staticpages(local) {
        return {
            PageTitle_en: 1,
            PageTitle_ar: 1,
            PageCode: 1,
            PageUrl: 1,
            Description_en: 1,
            Description_ar: 1,
            MetaTitle_en: 1,
            MetaTitle_ar: 1,
            MetaKey: 1,
            MetaDescription_en: 1,
            MetaDescription_ar: 1,
            DataAdded: 1,
            LastModified: 1,
            LastModifiedBy: 1
        };
    }
    Banner(local) {
        return {
            BannerName: 1,
            Image: 1,
            Description: "$Description_" + local,
            SequenceNo: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }
    Country(local) {
        return {
            CountryName: "$CountryName_" + local,
            CountryShortName:1,
            CountryCode: 1,
            Currency: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }
    Category(local) {
        return {
            CategoryName: "$CategoryName_" + local,
            Icon: 1,
            ParentCategoryId: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }
    SeatingType(local) {
        return {
            TypeName: "$TypeName_" + local,
            TotalRestaurants: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    Facility(local) {
        return {
            FacilityName: "$FacilityName_" + local,
            TotalRestaurants: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    Preference(local) {
        return {
            PreferenceName: "$PreferenceName_" + local,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    ReviewCategory(local) {
        return {
            ReviewCategoryName: "$ReviewCategoryName_" + local,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    RestaurantStyle(local) {
        return {
            RestaurantStyleName: "$RestaurantStyleName_" + local,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    CuisineType(local) {
        return {
            CuisineTypeName: "$CuisineTypeName_" + local,
            IsTrending: 1,
            TotalRestaurants: 1,
            SequenceNo: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    CategoryAlbum(local) {
        return {
            Name: "$Name_" + local,
            Image: 1,
            ApplicableCountries: 1,
            ApplicableRestaurants: 1,
            SequenceNo: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    Occasion(local) {
        return {
            OccasionName: "$OccasionName_" + local,
            Description: "$Description_" + local,
            ThumbnailImage: 1,
            TotalRestaurants: 1,
            // ApplicableCountries: 1,
            ApplicableRestaurants: 1,
            SequenceNo: 1,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    CustomerCoupon(local) {
        return {
            CouponCode: 1,
            CouponBy: 1,
            StartDate: 1,
            EndDate: 1,
            DiscountType: 1,
            Discount: 1,
            MaxDiscount: 1,
            DiscountAmount: 1,
            MinOrderAmount: 1,
            ApplicableCountries: 1,
            ApplicableRestaurants: 1,
            MaxUsage: 1,
            Description: "$Description_" + local,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    SubscriptionCoupon(local) {
        return {
            CouponCode: 1,
            StartDate: 1,
            EndDate: 1,
            DiscountType: 1,
            Discount: 1,
            DiscountQR: 1,
            DiscountDollar: 1,
            ApplicableCountries: 1,
            ApplicableRestaurants: 1,
            MaxDiscount: 1,
            MaxUsage: 1,
            Status: 1,
            Description: "$Description_" + local,
            CreatedAt: 1,
            UpdatedAt: 1
        };
    }

    SubscriptionPlan(local) {
        return {
            Title: "$Title_" + global.local,
            Validity: 1,
            ApplicableCountries: 1,
            PriceDollar: 1,
            PriceQR: 1,
            MaxBookingAllowed: 1,
            MaxBooking: 1,
            Description: "$Description_" + local,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1,
            PriceType: 1
        };
    }

    FeaturedPlan(local) {
        return {
            Title: "$Title_" + local,
            Validity: 1,
            PriceUSD: 1,
            PriceQR: 1,
            ApplicableCountries: 1,
            Description: "$Description_" + local,
            Status: 1,
            CreatedAt: 1,
            UpdatedAt: 1,
        };
    }

    Operator(local) {
        return {
            FirstName: "$FirstName_" + local,
            LastName: "$LastName_" + local,
            Email: 1,
            RestaurantId: 1,
            OperatorNumber: 1,
            Mobile: 1,
            Image: 1,
            Address: "$Address_" + local,
            CreatedAt: 1
        }
    }

    Restaurant(local) {
        return {
            Name: "$Name_" + local,
            BranchName: "$BranchName_" + local,
            CountryId: 1,
            BusinessType: 1,
            Email: 1,
            LandlineNumber: 1,
            Website: 1,
            RestaurantImage: 1,
            Address: 1,
            TotalBookings:1,
            OperatingHours:1,
            IsFeatured:1,
            AcceptTableBooking:1,
            AcceptPreOrder:1,
            ReviewCount:1,
            AverageRating:1,
            TotalBookings:1,
            CreatedAt: 1
        }
    }


}

module.exports = MasterProjection;

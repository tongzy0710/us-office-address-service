      const ROUTES = ["home", "broker", "tenant", "admin"];
      const PRICE_BANDS = ["$500 以下", "$500-$800", "$800-$1200", "$1200 以上"];
      const REVIEW_OPTIONS = ["待预审", "待审核", "已审核通过", "已退回补充", "地址预审未通过"];
      const SUITE_AUDIT_OPTIONS = ["草稿", "待审核", "待补充", "已审核通过"];
      const SUITE_STATUS_OPTIONS = ["可租赁", "已出租", "待确认"];
      const SUITE_DISPLAY_OPTIONS = ["可展示", "暂停推荐", "已出租"];
      const PAYMENT_OPTIONS = ["接受", "不接受", "待确认"];
      const ELECTRIC_OPTIONS = [
        "电力公司直开 suite 账单",
        "主账单 + suite 子账单",
        "仅公共电费主账单",
        "无法提供任何电费账单",
      ];
      const BROADBAND_OPTIONS = ["有", "无"];
      const RENT_INCLUDE_OPTIONS = ["物业费", "水电费", "宽带费", "建筑保险", "保洁服务费", "信件代收"];
      const MAIL_OPTIONS = ["不提供", "提供，但需要收费", "可以免费提供部分，超出部分收费"];
      const FURNITURE_OPTIONS = ["不提供家具", "可以付费租赁家具", "可以付费家具摆放，家具由客户自行采购"];
      const LOCK_OPTIONS = ["可独立上锁", "可制作专属公司门牌"];
      const STATUS_TAG_OPTIONS = ["历史注册地址已清理", "曾租给跨境电商公司", "适合跨境电商客户"];
      const BLANK = "";

      function makePhoto(label, tint) {
        const svg =
          '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
          '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="' +
          tint +
          '"/><stop offset="100%" stop-color="#fff"/></linearGradient></defs>' +
          '<rect width="800" height="600" rx="38" fill="url(#g)"/>' +
          '<rect x="40" y="40" width="720" height="520" rx="28" fill="rgba(255,255,255,.64)"/>' +
          '<text x="76" y="150" font-size="30" font-family="Arial" fill="#1f2933">CC Monet Demo Photo</text>' +
          '<text x="76" y="244" font-size="48" font-family="Arial" font-weight="700" fill="#1f2933">' +
          escapeSvg(label) +
          "</text></svg>";
        return {
          id: "photo-" + Math.random().toString(36).slice(2, 8),
          name: label,
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        };
      }

      function escapeSvg(text) {
        return String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }

      const state = {
        contacts: {
          wechat: "ccMonet-service",
          phone: "+1 (669) 555-0198",
          email: "service@ccmonet.example",
        },
        views: {
          s1: 132,
          s2: 61,
          s3: 118,
          s4: 94,
        },
        buildings: [
          {
            id: "b1",
            name: "Santa Clara Tech Park",
            rawAddress: "4701 Patrick Henry Dr, Santa Clara, CA 95054",
            city: "Santa Clara",
            state: "CA",
            zip: "95054",
            reviewStatus: "已审核通过",
            maintainerName: "湾区合作中介 A",
            maintainerId: "broker-001",
            paymentFlowStatus: "接受",
            paymentFlowNote:
              "先付 1 个月押金锁定地址，客户先用该地址注册公司，注册成功后再由新公司主体签正式合同并补齐租金与押金。",
            electricBillMode: "主账单 + suite 子账单",
            broadbandBillStatus: "有",
            verificationSource: "后台已复核",
            rentIncludes: ["物业费", "宽带费", "信件代收"],
            mailScan: "提供，但需要收费",
            forwarding: "可以免费提供部分，超出部分收费",
            furniture: "可以付费租赁家具",
            lockOptions: ["可独立上锁", "可制作专属公司门牌"],
            exteriorPhotos: [makePhoto("楼栋外围 1", "#d6c0a7"), makePhoto("楼栋外围 2", "#c2d3dc")],
            doorplatePhotos: [makePhoto("楼栋门牌 1", "#d7dfe7")],
            suites: [
              {
                id: "s1",
                suite: "Ste 207",
                area: 319,
                rent: 478.5,
                status: "可租赁",
                auditStatus: "已审核通过",
                tenantDisplay: "可展示",
                suitability: "适合跨境电商客户",
                tags: ["历史注册地址已清理", "适合跨境电商客户"],
                remark: "房间靠内侧，安静，适合作为首个美国真实经营地址。",
                insidePhotos: [
                  makePhoto("Suite 内景 1", "#d8e6f0"),
                  makePhoto("Suite 内景 2", "#e6ddd0"),
                  makePhoto("Suite 内景 3", "#d9d7ef"),
                ],
                doorPhotos: [makePhoto("房门 / 门牌 1", "#dfe7d4")],
              },
              {
                id: "s2",
                suite: "Ste 217",
                area: 280,
                rent: 630,
                status: "待确认",
                auditStatus: "待补充",
                tenantDisplay: "暂停推荐",
                suitability: "待判断",
                tags: [],
                remark: "等待补充门牌照片和房间内部第二张照片。",
                insidePhotos: [makePhoto("Suite 内景 1", "#e6ddd0")],
                doorPhotos: [],
              },
            ],
          },
          {
            id: "b2",
            name: "Fremont Gateway Center",
            rawAddress: "4288 Stevenson Blvd, Fremont, CA 94538",
            city: "Fremont",
            state: "CA",
            zip: "94538",
            reviewStatus: "待审核",
            maintainerName: "硅谷合作中介 B",
            maintainerId: "broker-002",
            paymentFlowStatus: "待确认",
            paymentFlowNote: "房东接受度还在确认中，后台会继续跟进。",
            electricBillMode: "电力公司直开 suite 账单",
            broadbandBillStatus: "有",
            verificationSource: "中介现场看过样本",
            rentIncludes: ["物业费", "建筑保险"],
            mailScan: "不提供",
            forwarding: "提供，但需要收费",
            furniture: "可以付费家具摆放，家具由客户自行采购",
            lockOptions: ["可独立上锁"],
            exteriorPhotos: [makePhoto("楼栋外围 1", "#eadfd0"), makePhoto("楼栋外围 2", "#dce7d5")],
            doorplatePhotos: [makePhoto("楼栋门牌 1", "#ddd5ef")],
            suites: [
              {
                id: "s3",
                suite: "Ste 118",
                area: 240,
                rent: 590,
                status: "可租赁",
                auditStatus: "已审核通过",
                tenantDisplay: "可展示",
                suitability: "适合跨境电商客户",
                tags: ["适合跨境电商客户"],
                remark: "直开独立电费账单能力强，适合对账单要求高的平台。",
                insidePhotos: [makePhoto("Suite 内景 1", "#dfe7d4"), makePhoto("Suite 内景 2", "#d8e6f0")],
                doorPhotos: [makePhoto("房门 / 门牌 1", "#e5d7cf")],
              },
            ],
          },
          {
            id: "b3",
            name: "Sunnyvale Business Hub",
            rawAddress: "1250 Borregas Ave, Sunnyvale, CA 94089",
            city: "Sunnyvale",
            state: "CA",
            zip: "94089",
            reviewStatus: "待预审",
            maintainerName: "湾区合作中介 A",
            maintainerId: "broker-001",
            paymentFlowStatus: "不接受",
            paymentFlowNote: "房东当前不接受先押金锁地址、注册后再签正式合同的标准流程。",
            electricBillMode: "仅公共电费主账单",
            broadbandBillStatus: "无",
            verificationSource: "中介口头确认",
            rentIncludes: ["物业费"],
            mailScan: "提供，但需要收费",
            forwarding: "提供，但需要收费",
            furniture: "不提供家具",
            lockOptions: [],
            exteriorPhotos: [makePhoto("楼栋外围 1", "#e4d6c8"), makePhoto("楼栋外围 2", "#dde8ef")],
            doorplatePhotos: [],
            suites: [
              {
                id: "s4",
                suite: "Ste 5A",
                area: 225,
                rent: 720,
                status: "待确认",
                auditStatus: "待审核",
                tenantDisplay: "暂停推荐",
                suitability: "待判断",
                tags: [],
                remark: "付款流程暂不符合标准方案，先不对外主推。",
                insidePhotos: [makePhoto("Suite 内景 1", "#eadbc8"), makePhoto("Suite 内景 2", "#d7e3ec")],
                doorPhotos: [makePhoto("房门 / 门牌 1", "#d9d7ef")],
              },
            ],
          },
        ],
      };

      const ui = {
        route: "home",
        broker: {
          selectedBuildingId: "b1",
          selectedSuiteId: "s1",
          filter: "all",
          mode: "dashboard",
          suiteStep: 1,
          buildingDraft: null,
          suiteDraft: null,
        },
        tenant: {
          search: BLANK,
          prices: [],
          cities: [],
          payments: [],
          electric: [],
          broadband: [],
          statuses: [],
          detailSuiteId: null,
          showPaymentNote: false,
          contactUnlocked: false,
          contactPhone: BLANK,
          contactName: BLANK,
          contactError: BLANK,
        },
        admin: {
          selectedBuildingId: "b1",
          selectedSuiteId: "s1",
          checkedSuiteIds: [],
          buildingReviewDraft: "已审核通过",
          suiteAuditDraft: "已审核通过",
          suiteStatusDraft: "可租赁",
          suiteDisplayDraft: "可展示",
          suiteRemarkDraft: BLANK,
        },
      };

      function routeFromHash() {
        const current = location.hash.replace(/^#/, "");
        return ROUTES.includes(current) ? current : "home";
      }

      function escapeHtml(value) {
        return String(value || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      function formatMoney(value) {
        const number = Number(value || 0);
        return "$" + number.toLocaleString("en-US", { minimumFractionDigits: number % 1 ? 2 : 0, maximumFractionDigits: 2 });
      }

      function toneFor(text) {
        if (!text) return "info";
        if (String(text).includes("通过") || String(text).includes("可租赁") || String(text).includes("接受") || String(text).includes("可展示")) return "good";
        if (String(text).includes("待")) return "warn";
        if (String(text).includes("不接受") || String(text).includes("退回") || String(text).includes("未通过") || String(text).includes("暂停")) return "danger";
        return "info";
      }

      function chip(text, tone) {
        return '<span class="chip ' + (tone || toneFor(text)) + '">' + escapeHtml(text) + "</span>";
      }

      function photoGrid(photos) {
        if (!photos || photos.length === 0) {
          return '<div class="empty">当前还没有照片</div>';
        }
        return '<div class="thumbs">' +
          photos
            .map(function (photo) {
              return '<div class="thumb" style="background-image:url(\'' +
                photo.url +
                '\')"><span>' +
                escapeHtml(photo.name) +
                "</span></div>";
            })
            .join("") +
          "</div>";
      }

      function makeBuildingDraft(source) {
        if (source) {
          return {
            id: source.id,
            name: source.name,
            rawAddress: source.rawAddress,
            city: source.city,
            state: source.state,
            zip: source.zip,
            paymentFlowStatus: source.paymentFlowStatus,
            paymentFlowNote: source.paymentFlowNote,
            electricBillMode: source.electricBillMode,
            broadbandBillStatus: source.broadbandBillStatus,
            rentIncludes: source.rentIncludes.slice(),
            mailScan: source.mailScan,
            forwarding: source.forwarding,
            furniture: source.furniture,
            lockOptions: source.lockOptions.slice(),
            exteriorPhotos: source.exteriorPhotos.slice(),
            doorplatePhotos: source.doorplatePhotos.slice(),
          };
        }

        return {
          id: null,
          name: BLANK,
          rawAddress: BLANK,
          city: BLANK,
          state: "CA",
          zip: BLANK,
          paymentFlowStatus: "待确认",
          paymentFlowNote:
            "先付 1 个月押金锁定地址，客户先用该地址注册公司，注册成功后再由新公司主体签正式合同并补齐租金与押金。",
          electricBillMode: "主账单 + suite 子账单",
          broadbandBillStatus: "无",
          rentIncludes: [],
          mailScan: "不提供",
          forwarding: "不提供",
          furniture: "不提供家具",
          lockOptions: [],
          exteriorPhotos: [],
          doorplatePhotos: [],
        };
      }

      function makeSuiteDraft(buildingId, source) {
        if (source) {
          return {
            id: source.id,
            buildingId: buildingId,
            suite: source.suite,
            area: source.area,
            rent: source.rent,
            status: source.status,
            suitability: source.suitability,
            tags: source.tags.slice(),
            remark: source.remark,
            insidePhotos: source.insidePhotos.slice(),
            doorPhotos: source.doorPhotos.slice(),
          };
        }

        return {
          id: null,
          buildingId: buildingId,
          suite: BLANK,
          area: BLANK,
          rent: BLANK,
          status: "可租赁",
          suitability: "待判断",
          tags: [],
          remark: BLANK,
          insidePhotos: [],
          doorPhotos: [],
        };
      }

      function getBuilding(id) {
        return state.buildings.find(function (item) {
          return item.id === id;
        }) || state.buildings[0] || null;
      }

      function getSuite(building, suiteId) {
        if (!building) return null;
        return building.suites.find(function (item) {
          return item.id === suiteId;
        }) || building.suites[0] || null;
      }

      function allSuites() {
        return state.buildings.flatMap(function (building) {
          return building.suites.map(function (suite) {
            return { building: building, suite: suite };
          });
        });
      }

      function visibleTenantListings() {
        return allSuites()
          .filter(function (row) {
            return row.building.reviewStatus === "已审核通过" && row.suite.auditStatus === "已审核通过" && row.suite.tenantDisplay === "可展示";
          })
          .map(function (row) {
            return {
              id: row.suite.id,
              buildingId: row.building.id,
              buildingName: row.building.name,
              address: row.building.rawAddress,
              city: row.building.city,
              state: row.building.state,
              suite: row.suite.suite,
              rent: row.suite.rent,
              area: row.suite.area,
              status: row.suite.status,
              paymentFlowStatus: row.building.paymentFlowStatus,
              paymentFlowNote: row.building.paymentFlowNote,
              electricBillMode: row.building.electricBillMode,
              broadbandBillStatus: row.building.broadbandBillStatus,
              rentIncludes: row.building.rentIncludes.slice(),
              mailScan: row.building.mailScan,
              forwarding: row.building.forwarding,
              furniture: row.building.furniture,
              lockOptions: row.building.lockOptions.slice(),
              tags: row.suite.tags.slice(),
              remark: row.suite.remark,
              exteriorPhotos: row.building.exteriorPhotos.slice(),
              doorplatePhotos: row.building.doorplatePhotos.slice(),
              insidePhotos: row.suite.insidePhotos.slice(),
              doorPhotos: row.suite.doorPhotos.slice(),
              viewCount: state.views[row.suite.id] || 0,
            };
          });
      }

      function matchesPriceBand(rent, band) {
        if (band === "$500 以下") return rent < 500;
        if (band === "$500-$800") return rent >= 500 && rent <= 800;
        if (band === "$800-$1200") return rent > 800 && rent <= 1200;
        return rent > 1200;
      }

      function tenantFilteredListings() {
        return visibleTenantListings()
          .filter(function (item) {
            const keyword = ui.tenant.search.trim().toLowerCase();
            const matchesSearch =
              !keyword ||
              [item.buildingName, item.suite, item.address, item.city, item.state].join(" ").toLowerCase().includes(keyword);
            const matchesCity = ui.tenant.cities.length === 0 || ui.tenant.cities.includes(item.city);
            const matchesPrice =
              ui.tenant.prices.length === 0 ||
              ui.tenant.prices.some(function (band) {
                return matchesPriceBand(item.rent, band);
              });
            const matchesPayment =
              ui.tenant.payments.length === 0 || ui.tenant.payments.includes(item.paymentFlowStatus);
            const matchesElectric =
              ui.tenant.electric.length === 0 || ui.tenant.electric.includes(item.electricBillMode);
            const matchesBroadband =
              ui.tenant.broadband.length === 0 || ui.tenant.broadband.includes(item.broadbandBillStatus);
            const matchesStatus =
              ui.tenant.statuses.length === 0 || ui.tenant.statuses.includes(item.status);
            return matchesSearch && matchesCity && matchesPrice && matchesPayment && matchesElectric && matchesBroadband && matchesStatus;
          })
          .sort(function (a, b) {
            return a.rent - b.rent || b.viewCount - a.viewCount;
          });
      }

      function hotListings() {
        return visibleTenantListings()
          .filter(function (item) {
            return item.status === "可租赁";
          })
          .sort(function (a, b) {
            return b.viewCount - a.viewCount || a.rent - b.rent;
          })
          .slice(0, 3);
      }

      function paymentFlowHint() {
        return "先付 1 个月押金锁定地址，客户先用该地址注册公司，注册成功后再由新公司主体签正式合同并补齐租金与押金，尽量避免平台审核时出现注册地址与租赁文件不一致。";
      }

      function electricBillLabel(value) {
        if (value === "电力公司直开 suite 账单") return "电力公司直开 Suite 独立账单";
        if (value === "主账单 + suite 子账单") return "电力公司主账单 + 房东按 Suite 开具公司抬头子电费账单";
        if (value === "仅公共电费主账单") return "仅有整栋楼公共电费主账单";
        return "无法提供任何电费账单";
      }

      function broadbandLabel(value) {
        return value === "有" ? "可提供独立、公司抬头宽带账单" : "暂无独立、公司抬头宽带账单";
      }

      function renderHomeTabs() {
        document.querySelectorAll(".tab[data-route]").forEach(function (tab) {
          tab.classList.toggle("active", tab.dataset.route === ui.route);
        });
        document.querySelectorAll(".screen").forEach(function (screen) {
          screen.classList.toggle("active", screen.id === ui.route);
        });
      }

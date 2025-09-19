package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/config"
	"github.com/go-kratos/kratos/v2/config/file"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware/logging"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/go-kratos/kratos/v2/transport/http"

	"github.com/go-erp/auth/internal/conf"
	"github.com/go-erp/auth/internal/data"
	"github.com/go-erp/auth/internal/biz"
	"github.com/go-erp/auth/internal/service"
	"github.com/go-erp/auth/internal/server"
)

// go build -ldflags "-X main.Version=x.y.z"
var (
	// Name is the name of the compiled software.
	Name string = "auth"
	// Version is the version of the compiled software.
	Version string = "v1.0.0"
	// BuildTime is the build time of the compiled software.
	BuildTime string = "unknown"
	// GitCommit is the git commit of the compiled software.
	GitCommit string = "unknown"

	flagconf = flag.String("conf", "../../configs", "config path, eg: -conf config.yaml")
)

func newApp(logger log.Logger, gs *grpc.Server, hs *http.Server) *kratos.App {
	return kratos.New(
		kratos.ID(Name),
		kratos.Name(Name),
		kratos.Version(Version),
		kratos.Metadata(map[string]string{
			"build_time":  BuildTime,
			"git_commit": GitCommit,
		}),
		kratos.Logger(logger),
		kratos.Server(
			gs,
			hs,
		),
	)
}

func main() {
	flag.Parse()

	// 初始化日志
	logger := log.With(log.NewStdLogger(os.Stdout),
		"ts", log.DefaultTimestamp,
		"caller", log.DefaultCaller,
		"service.id", Name,
		"service.name", Name,
		"service.version", Version,
	)

	// 加载配置
	c := config.New(
		config.WithSource(
			file.NewSource(*flagconf),
		),
	)
	defer c.Close()

	if err := c.Load(); err != nil {
		panic(err)
	}

	var bc conf.Bootstrap
	if err := c.Scan(&bc); err != nil {
		panic(err)
	}

	// 初始化数据层
	dataRepo, cleanup, err := data.NewData(bc.Data, logger)
	if err != nil {
		panic(err)
	}
	defer cleanup()

	// 初始化业务逻辑层
	userRepo := data.NewUserRepository(dataRepo, logger)
	authUsecase := biz.NewAuthUsecase(userRepo, logger)
	userUsecase := biz.NewUserUsecase(userRepo, logger)

	// 初始化服务层
	authService := service.NewAuthService(authUsecase, logger)
	userService := service.NewUserService(userUsecase, logger)

	// 初始化服务器
	httpSrv := server.NewHTTPServer(bc.Server, authService, userService, logger)
	grpcSrv := server.NewGRPCServer(bc.Server, authService, userService, logger)

	// 创建应用
	app := newApp(logger, grpcSrv, httpSrv)

	// 启动应用
	if err := app.Run(); err != nil {
		panic(err)
	}
}
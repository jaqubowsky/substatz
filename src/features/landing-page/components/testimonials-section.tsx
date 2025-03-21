import Image from "next/image";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      content:
        "SubStatz has saved me hundreds of dollars by helping me identify subscriptions I forgot I had. The interface is clean and intuitive, making it easy to manage everything in one place.",
      author: {
        name: "Sarah Johnson",
        role: "Marketing Manager",
        image: "https://randomuser.me/api/portraits/women/32.jpg",
      },
    },
    {
      content:
        "I was paying for three different streaming services I barely used. Thanks to SubStatz, I was able to identify and cancel them before renewal. The one-time payment model is also refreshing!",
      author: {
        name: "Michael Chen",
        role: "Software Engineer",
        image: "https://randomuser.me/api/portraits/men/46.jpg",
      },
    },
    {
      content:
        "As someone who manages both personal and business subscriptions, this tool has been a lifesaver. The spending insights feature gives me a clear picture of where my money is going each month.",
      author: {
        name: "Emily Rodriguez",
        role: "Small Business Owner",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See what our users are saying
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="h-full">
                <figure className="flex h-full flex-col rounded-2xl bg-primary/10 p-8 text-sm leading-6 shadow-soft">
                  <blockquote className="flex-grow text-gray-900">
                    <p>{`"${testimonial.content}"`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-50">
                      <Image
                        src={testimonial.author.image}
                        alt={testimonial.author.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                        priority={index < 2}
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.author.name}
                      </div>
                      <div className="text-accent-foreground">
                        {testimonial.author.role}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
